const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifications.controller.js");
const auth = require("../middleware/auth.js");
const validateIdParam = require("../middleware/validateIdParam.js");

// Create a new notification
router.post("/", auth, notificationsController.createNotification);

// Delete a notification by ID
router.delete("/:id_notification", auth, validateIdParam("id_notification"), notificationsController.deleteNotification);

module.exports = router;
