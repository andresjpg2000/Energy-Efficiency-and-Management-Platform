const { Notification } = require("../models/index.js");

// Get all notifications
async function getAllNotifications(req, res, next) {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
}

// Create a new notification
async function createNotification(req, res, next) {
  try {
    const { type, id_user, id_consumption, message } = req.body;

    if (!type || !message || !id_user) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newNotification = await Notification.create({
      type,
      id_user,
      id_consumption: id_consumption || null,
      message,
    });

    res.status(201).json({
      message: "Notification created successfully",
      data: newNotification,
    });
  } catch (error) {
    next(error);
  }
}

// Delete a notification by ID
async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllNotifications,
  createNotification,
  deleteNotification,
};
