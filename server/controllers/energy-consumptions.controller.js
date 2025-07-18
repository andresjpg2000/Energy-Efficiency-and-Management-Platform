const {
  EnergyConsumption,
  Housing,
  Supplier,
  Notifications,
  User,
} = require("../models/index.js");
const { Op } = require("sequelize");

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

    await generateAlertsIfNeeded(newConsumption);

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
  } catch (err) {
    next(err);
  }
};

async function generateAlertsIfNeeded(consumption) {
  try {
    const housing = await Housing.findByPk(consumption.id_housing);

    const user = await User.findByPk(housing.id_user);

    // Check if user has notification settings
    if (!user || !user.notification_settings) return;

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
      parsedPrefs.thresholds &&
      parsedPrefs.thresholds.consumption !== undefined &&
      value > parsedPrefs.thresholds.consumption
    ) {
      await createNotification(
        user.id_user,
        consumption.id_consumption,
        `High consumption: ${value.toFixed(2)} kWh`,
      );
    }

    const supplier = await Supplier.findByPk(housing.id_supplier);
    if (parsedPrefs.thresholds && parsedPrefs.thresholds.cost !== undefined) {
      const estimatedCost = supplier.cost_kWh * value;

      if (estimatedCost > parsedPrefs.thresholds.cost) {
        await createNotification(
          user.id_user,
          consumption.id_consumption,
          `Estimated cost: ${estimatedCost.toFixed(2)}€`,
        );
      }
    }
  } catch (error) {
    // Log the error but do not throw it to avoid breaking the consumption request
    console.warn("Error generating alerts:", error);
  }
}

async function createNotification(id_user, id_consumption, message) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const exists = await Notifications.findOne({
    where: {
      id_user,
      id_consumption,
      message,
      type: "Alert",
      createdAt: {
        [Op.between]: [todayStart, todayEnd],
      },
    },
  });

  if (!exists) {
    await Notifications.create({
      type: "Alert",
      id_user,
      id_consumption,
      message,
    });
  }
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
          rel: "create",
          href: `/energy-consumptions`,
          method: "POST",
        },
      ],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addEnergyConsumption,
  deleteEnergyConsumption,
};
