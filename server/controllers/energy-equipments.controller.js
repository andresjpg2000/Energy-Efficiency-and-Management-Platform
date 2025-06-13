const { EnergyEquipment, Housing } = require("../models/index.js");
const { Op } = require("sequelize");

// Listar todos os equipamentos
async function getAllEnergyEquipments(req, res, next) {
  try {
    const equipments = await EnergyEquipment.findAll();
    res.status(200).json({ data: equipments });
  } catch (error) {
    next(error);
  }
}

// Criar um novo equipamento
async function createEnergyEquipment(req, res, next) {
  try {
    const { energy_type, capacity, housing, name } = req.body;

    if (!energy_type || !capacity || !housing) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const housingExists = await Housing.findByPk(housing);
    if (!housingExists) {
      return res.status(400).json({ message: "Housing ID does not exist." });
    }

    const equipmentData = {
      energy_type,
      capacity,
      housing,
    };

    if (name) {
      equipmentData.name = name;
    } else {
      equipmentData.name = null;
    }

    const newEquipment = await EnergyEquipment.create(equipmentData);

    res.status(201).json({
      message: "Equipment has been registered.",
      id_equipment: newEquipment.id_equipment,
    });
  } catch (error) {
    next(error);
  }
}

// Atualizar nome de um equipamento
async function updateEnergyEquipmentName(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const bodyKeys = Object.keys(req.body);
    if (!name || bodyKeys.length !== 1 || bodyKeys[0] !== "name") {
      return res.status(400).json({
        message:
          "The 'name' field is required and must be the only field in the request body.",
      });
    }

    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: "The name must have at least 3 characters." });
    }

    const equipment = await EnergyEquipment.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    await equipment.update({ name });
    res
      .status(200)
      .json({ message: "The name has been successfully changed." });
  } catch (error) {
    next(error);
  }
}

// Eliminar um equipamento
async function deleteEnergyEquipment(req, res, next) {
  try {
    const { id } = req.params;

    const equipment = await EnergyEquipment.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    await equipment.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Get given energy by equipment
async function getGivenEnergyOfEquipment(req, res, next) {
  try {
    const equipment = await EnergyEquipment.findByPk(req.params.id, {
      attributes: ["id_equipment"],
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    let start;
    if (req.query.start) {
      start = new Date(req.query.start);
    } else {
      start = new Date(0);
    }

    let end;
    if (req.query.end) {
      end = new Date(req.query.end);
    } else {
      end = new Date();
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date." });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date." });
    }

    const dateFilter = {
      date: {
        [Op.between]: [start, end],
      },
    };

    const givenEnergy = await equipment.getGivenEnergies({
      where: dateFilter,
      attributes: ["id_equipment", "value", "date"],
    });

    equipment.dataValues.givenEnergy = givenEnergy;

    res.status(200).json({ data: equipment });
  } catch (error) {
    next(error);
  }
}

// Get energy productions by equipment
async function getEnergyProductionsOfEquipment(req, res, next) {
  try {
    const equipment = await EnergyEquipment.findByPk(req.params.id, {
      attributes: ["id_equipment"],
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    let start;
    if (req.query.start) {
      start = new Date(req.query.start);
    } else {
      start = new Date(0);
    }

    let end;
    if (req.query.end) {
      end = new Date(req.query.end);
    } else {
      end = new Date();
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date." });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date." });
    }

    const dateFilter = {
      date: {
        [Op.between]: [start, end],
      },
    };

    const EnergyProductions = await equipment.getEnergyProductions({
      where: dateFilter,
      attributes: ["id_equipment", "value", "date"],
    });

    equipment.dataValues.EnergyProductions = EnergyProductions;

    res.status(200).json({ data: equipment });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllEnergyEquipments,
  createEnergyEquipment,
  updateEnergyEquipmentName,
  deleteEnergyEquipment,
  getGivenEnergyOfEquipment,
  getEnergyProductionsOfEquipment,
};
