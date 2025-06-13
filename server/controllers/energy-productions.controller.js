// Import the users data model
const e = require("cors");
const {
  EnergyProductions,
  EnergyEquipment,
  Housing,
  User,
  Notifications,
} = require("../models/index.js");
const { Op } = require("sequelize");

// get all energy returns
let getAllEnergyProductions = async (req, res, next) => {
  if (!req.query.userId) {
    return res.status(400).json({ message: "user ID is required" });
  }

  let filterEnergy;
  let equipments = [];

  try {
    if (!req.query.equipmentId && !req.query.houseId) {
      equipments = await allUserEquipments(parseInt(req.query.userId));
    } else if (!req.query.equipmentId && req.query.houseId) {
      equipments = await allequipmentsHouse(
        parseInt(req.query.houseId),
        parseInt(req.query.userId)
      );
    } else if (req.query.equipmentId && !req.query.houseId) {
      const eq = await EnergyEquipment.findOne({
        where: { id_equipment: parseInt(req.query.equipmentId) },
      });
      if (!eq) return res.status(404).json({ message: "Equipment not found" });

      const hs = await Housing.findOne({
        where: { id_housing: eq.housing, id_user: parseInt(req.query.userId) },
      });
      if (!hs)
        return res
          .status(403)
          .json({ message: "House does not belong to the user" });

      equipments.push(parseInt(req.query.equipmentId));
    } else {
      return res.status(400).json({
        message: "Can't use equipment ID and house ID at the same time",
      });
    }
  } catch (error) {
    return next(error);
  }

  // Parse and validate dates
  const start = req.query.start ? new Date(req.query.start) : new Date(0);
  const end = req.query.end ? new Date(req.query.end) : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  if (start > end) {
    return res
      .status(400)
      .json({ message: "The param end must be after start!" });
  }

  // Pagination: parse size and page
  const size = parseInt(req.query.size) || 10;
  const page = parseInt(req.query.page) || 1;

  if (size <= 0 || page <= 0) {
    return res
      .status(400)
      .json({ message: "Page and size must be greater than 0" });
  }

  const offset = (page - 1) * size;

  try {
    const { count, rows } = await EnergyProductions.findAndCountAll({
      where: {
        id_equipment: { [Op.in]: equipments },
        date: { [Op.between]: [start, end] },
      },
      limit: size,
      offset,
      order: [["date", "ASC"]],
    });

    if (rows.length === 0) {
      return res.status(404).json({ message: "No energies productions found" });
    }

    return res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / size),
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving energy returns",
      error: err.message,
    });
  }
};

let addEnergyProduction = async (req, res) => {
  const { id_equipment, date, value } = req.body;

  if (!id_equipment || !date || !value) {
    return res.status(400).json({
      message: "Equipament ID, Date and Value are required",
    });
  }

  if (isNaN(id_equipment) || isNaN(value)) {
    return res.status(400).json({
      message: "Equipament ID and Value must be numbers",
    });
  }

  if (id_equipment < 0 || value < 0) {
    return res.status(400).json({
      message: "Equipament ID and Value must be positive numbers",
    });
  }

  const finalDate = new Date(date);
  if (isNaN(finalDate.getTime())) {
    return res.status(400).json({
      message: "Invalid date format",
    });
  }

  // Verifica se o equipamento existe
  const equipment = await EnergyEquipment.findByPk(id_equipment);
  if (!equipment) {
    return res.status(404).json({
      message: "Equipment not found",
    });
  }

  try {
    const createdProduction = await EnergyProductions.create({
      value,
      id_equipment,
      date: finalDate,
    });

    res.status(201).json({
      message: "Energy production created",
      data: createdProduction,
    });

    // Alertas abaixo…
    try {
      const housing = await Housing.findByPk(equipment.housing);
      const user = await User.findByPk(housing.id_user);
      let prefs = user.notification_settings;

      // Se prefs for string, faz parse
      if (typeof prefs === "string") {
        prefs = JSON.parse(prefs);
      }

      // Verifica se alertas estão ativos
      let alertsEnabled = false;
      if (prefs.alerts === true) {
        alertsEnabled = true;
      } else if (prefs.alerts === "true") {
        alertsEnabled = true;
      } else if (
        typeof prefs.alerts === "string" &&
        prefs.alerts.toLowerCase() === "true"
      ) {
        alertsEnabled = true;
      }

      if (!alertsEnabled) {
        return;
      }

      // Verifica limiar de produção
      if (
        prefs.thresholds &&
        prefs.thresholds.generation !== undefined &&
        createdProduction.value < prefs.thresholds.generation
      ) {
        const date = new Date(createdProduction.date).toLocaleDateString(
          "en-GB"
        );
        const valueStr = createdProduction.value.toFixed(2);

        await Notifications.create({
          type: "Alert",
          id_user: user.id_user,
          message: `Low energy generation: only ${valueStr} kWh produced on ${date}.`,
        });
      }
    } catch (alertError) {
      console.error("Erro ao gerar alerta de produção:", alertError);
    }
  } catch (err) {
    res.status(500).json({
      message: "Error creating energy production",
      error: err.message,
    });
  }
};

let deleteEnergyProduction = async (req, res, next) => {
  try {
    // energy id
    const id = parseInt(req.params.id);

    // check if the id is a number
    const energy = await EnergyProductions.findByPk(id);
    if (!energy) {
      return res.status(404).json({ message: "Energy not found." });
    }

    //delete the energy return
    await energy.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Error creating energy return",
      error: error.message,
    });
  }
};

async function allUserEquipments(user) {
  const houses = await Housing.findAll({
    where: {
      id_user: user,
    },
  });

  const houseIds = houses.map((h) => h.id_housing);

  let equipments = await EnergyEquipment.findAll({
    where: {
      housing: {
        [Op.in]: houseIds,
      },
    },
  });

  equipments = equipments.map((e) => e.id_equipment);

  return equipments;
}

async function allequipmentsHouse(house, user) {
  const hs = await Housing.findOne({
    where: {
      id_housing: house,
      id_user: user,
    },
  });
  if (!hs) {
    const error = new Error("House does not belong to the user");
    error.statusCode = 403;
    throw error;
  }
  const equipments = await EnergyEquipment.findAll({
    where: {
      housing: house,
    },
  });
  const equipmentIds = equipments.map((e) => e.id_equipment);

  return equipmentIds;
}

module.exports = {
  getAllEnergyProductions,
  addEnergyProduction,
  deleteEnergyProduction,
};
