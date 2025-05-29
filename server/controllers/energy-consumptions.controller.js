const { EnergyConsumption, Housing, Supplier, Notification, User } = require("../models/index.js");
const { UniqueConstraintError, ValidationError } = require("sequelize");

// Create consumption
const addEnergyConsumption = async (req, res, next) => {
  if (!req.body || !req.body.value || !req.body.date || !req.body.id_housing) {
    return res
      .status(400)
      .json({ message: "value, date and id_housing are required!" });
  }

  const id_housing = req.body.id_housing;
  const id_user = req.user.id_user;

  try {
    // Check if the housing belongs to the user
    const housing = await Housing.findOne({
      where: {
        id_housing,
        id_user,
      },
    });

    if (!housing) {
      return res
        .status(403)
        .json({ message: "You do not have access to this housing." });
    }
  } catch (error) {
    console.error("Error verifying ownership:", error);
    return res.status(500).json({ message: "Internal server error." });
  }

  try {
    const newConsumption = await EnergyConsumption.create({
      value: req.body.value,
      date: req.body.date,
      id_housing: req.body.id_housing,
    });

    res.status(201).json({
      data: newConsumption,
      links: [
        {
          rel: "self",
          href: `/energy-consumptions`,
          method: "POST",
        },
        {
          rel: "delete",
          href: `/energy-consumptions/${newConsumption.id_consumption}`,
          method: "DELETE",
        },
      ],
    });

    // NOTIFICAÇÕES AUTOMÁTICAS COM BASE EM PREFERÊNCIAS
    try {
      const housing = await Housing.findByPk(newConsumption.id_housing);
      const user = await User.findByPk(housing.id_user);
      const prefs = user.notification_settings;

      // ALERTA DE CONSUMO
      if (
        prefs?.alerts &&
        prefs.thresholds?.consumption &&
        newConsumption.value > prefs.thresholds.consumption
      ) {
        const date = new Date(newConsumption.date).toLocaleDateString("pt-PT");
        const value = newConsumption.value.toFixed(2).replace(".", ",");

        await Notification.create({
          type: "Alert",
          id_user: user.id_user,
          id_consumption: newConsumption.id_consumption,
          message: `Consumo elevado: ${value} kWh registados em ${date}.`,
        });
      }

      // ALERTA DE CUSTO
      const supplier = await Supplier.findByPk(housing.id_supplier);
      if (supplier && prefs?.alerts && prefs.thresholds?.cost) {
        const estimatedCost = supplier.cost_kWh * newConsumption.value;

        if (estimatedCost > prefs.thresholds.cost) {
          const costFormatted = estimatedCost.toFixed(2).replace(".", ",");

          await Notification.create({
            type: "Alert",
            id_user: user.id_user,
            id_consumption: newConsumption.id_consumption,
            message: `Custo energético estimado atingiu ${costFormatted}€ com este consumo.`,
          });
        }
      }
    } catch (alertError) {
      console.error("Erro ao gerar alertas de consumo:", alertError);
    }
  } catch (err) {
    // Handle any errors that occur during the database query
    console.error("Error creating consumption:", err);

    // Handle specific db.Sequelize validation errors and join them into a single message
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.errors.map((err) => err.message).join(", "),
      });
    }
    // Handle unique constraint errors
    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Consumption already exists!",
      });
    }
    // Handle other errors
    next(err);
  }
};

// Delete consumption
const deleteEnergyConsumption = async (req, res, next) => {
  try {
    const response = await EnergyConsumption.destroy({
      where: {
        id_consumption: req.params.id_consumption,
      },
    });

    if (!response) {
      return res.status(404).json({ message: "Consumption not found!" });
    }

    res.status(204).json({
      message: "Consumption deleted successfully!",
      links: [
        {
          rel: "self",
          href: `/energy-consumptions/${req.params.id_consumption}`,
          method: "DELETE",
        },
        {
          rel: "create",
          href: `/energy-consumptions`,
          method: "POST",
        },
      ],
    });
  } catch (err) {
    console.error("Error deleting consumption:", err);
    next(err);
  }
};

module.exports = {
  addEnergyConsumption,
  deleteEnergyConsumption,
};
