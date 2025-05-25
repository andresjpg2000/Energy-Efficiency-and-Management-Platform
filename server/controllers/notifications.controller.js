const {
  Notifications,
  User,
  EnergyConsumption,
} = require("../models/index.js");

// Create a new notification
async function createNotification(req, res, next) {
  try {
    const { type, id_user, id_consumption, message } = req.body;

    // Validate required fields
    if (!type) {
      return res
        .status(400)
        .json({ errorMessage: "NOTIFICATION TYPE field required." });
    }
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

    // Create the notification
    const notification = await Notifications.create({
      type,
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
// async function getNotificationsByUser(req, res, next) {
//   try {
//     const { id_user } = req.params.id_user;

//     // Validate user exists
//     const user = await User.findByPk(id_user);
//     if (!user) {
//       return res.status(404).json({
//         message: "The user with the provided credentials was not found.",
//       });
//     }

//     const notifications = await Notifications.findAll({
//       where: { id_user },
//     });

//     res.status(200).json(notifications);
//   } catch (error) {
//     next(error);
//   }
// }

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
};
