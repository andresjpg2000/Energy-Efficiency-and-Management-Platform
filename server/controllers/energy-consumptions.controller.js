const {
  EnergyConsumption,
  Housing,
  Supplier,
  Notifications,
  User,
} = require("../models/index.js");
const { UniqueConstraintError, ValidationError } = require("sequelize");

// Create consumption
const addEnergyConsumption = async (req, res, next) => {
  if (!req.body || !req.body.value || !req.body.date || !req.body.id_housing) {
    return res
      .status(400)
      .json({ message: "value, date and id_housing are required!" });
  }

  const value = req.body.value;
  const date = req.body.date;
  const id_housing = req.body.id_housing;
  const id_user = req.user.id_user;

  const housing = await Housing.findOne({ where: { id_housing, id_user } });
  if (!housing) {
    return res
      .status(403)
      .json({ message: "You do not have access to this housing." });
  }

  try {
    const newConsumption = await EnergyConsumption.create({
      value,
      date,
      id_housing,
    });

    res.status(201).json({
      data: newConsumption,
      links: [
        { rel: "self", href: `/energy-consumptions`, method: "POST" },
        {
          rel: "delete",
          href: `/energy-consumptions/${newConsumption.id_consumption}`,
          method: "DELETE",
        },
      ],
    });

    await generateAlertsIfNeeded(newConsumption);
  } catch (err) {
    console.error("Error creating consumption:", err);

    if (err instanceof ValidationError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({ message: "Consumption already exists!" });
    }

    next(err);
  }
};

async function generateAlertsIfNeeded(consumption) {
  try {
    const housing = await Housing.findByPk(consumption.id_housing);
    const user = await User.findByPk(housing.id_user);
    const prefs = user.notification_settings;
    const parsedPrefs = typeof prefs === "string" ? JSON.parse(prefs) : prefs;

    const alertsEnabled =
      parsedPrefs.alerts === true ||
      parsedPrefs.alerts === "true" ||
      (typeof parsedPrefs.alerts === "string" &&
        parsedPrefs.alerts.toLowerCase() === "true");

    if (!alertsEnabled) return;

    const value = consumption.value;

    if (
      parsedPrefs.thresholds?.consumption &&
      value > parsedPrefs.thresholds.consumption
    ) {
      await createNotification(
        user.id_user,
        consumption.id_consumption,
        `High consumption: ${value} kWh`
      );
    }

    const supplier = await Supplier.findByPk(housing.id_supplier);
    if (supplier && parsedPrefs.thresholds?.cost) {
      const estimatedCost = supplier.cost_kWh * value;
      if (estimatedCost > parsedPrefs.thresholds.cost) {
        await createNotification(
          user.id_user,
          consumption.id_consumption,
          `Estimated cost: ${estimatedCost.toFixed(2)}€`
        );
      }
    }
  } catch (error) {
    console.error("Error generating alerts:", error);
  }
}

async function createNotification(id_user, id_consumption, message) {
  await Notifications.create({
    type: "Alert",
    id_user,
    id_consumption,
    message,
  });
}

// Delete consumption
const deleteEnergyConsumption = async (req, res, next) => {
  try {
    const response = await EnergyConsumption.destroy({
      where: { id_consumption: req.params.id_consumption },
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
