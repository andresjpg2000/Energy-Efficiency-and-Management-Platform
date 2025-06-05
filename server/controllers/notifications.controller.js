const {
  Notifications,
  User,
  EnergyConsumption,
} = require("../models/index.js");

// Create a new notification
async function createNotification(req, res, next) {
  try {
    const { id_user, id_consumption, message } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({ errorMessage: "MESSAGE field required." });
    }
    if (!id_user) {
      return res.status(400).json({ errorMessage: "USER_ID field required." });
    }

    // Validate user exists
    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({
        errorMessage: "The user with the provided credentials was not found.",
      });
    }

    // Validate consumption exists if provided
    if (id_consumption) {
      const consumption = await EnergyConsumption.findByPk(id_consumption);
      if (!consumption) {
        return res
          .status(404)
          .json({ errorMessage: "Consumption record not found" });
      }
    }

    // Create the notification (forcing type to 'Alert')
    const notification = await Notifications.create({
      type: "Alert", // Forçado aqui
      id_user,
      id_consumption,
      message,
    });

    res.status(201).json({
      message: "Notification created",
      id_notification: notification.id_notification,
    });
  } catch (error) {
    next(error);
  }
}

// Get all notifications for a specific user
const getMyAlerts = async (req, res) => {
  try {

    if (!req.user || !req.user.id_user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: missing user info" });
    }

    const id_user = req.user.id_user;

    const alerts = await Notifications.findAll({
      where: {
        id_user,
        type: "Alert",
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ data: alerts });
  } catch (err) {
    console.error("Error fetching alerts:", err);
    return res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Delete a notification by ID
async function deleteNotification(req, res, next) {
  try {
    const { id_notification } = req.params;

    const notification = await Notifications.findByPk(id_notification);
    if (!notification) {
      return res.status(404).json({ errorMessage: "Notification not found." });
    }

    await notification.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createNotification,
  deleteNotification,
  getMyAlerts,
};
