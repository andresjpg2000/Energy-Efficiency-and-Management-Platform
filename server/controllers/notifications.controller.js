const {
  Notifications,
  User,
  EnergyConsumption,
  EnergyEquipment,
} = require("../models/index.js");

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
      include: [
        {
          model: EnergyConsumption,
          attributes: ["id_housing"],
        },
      ],
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
  deleteNotification,
  getMyAlerts,
};
