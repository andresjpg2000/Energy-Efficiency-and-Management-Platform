const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller.js');
const validateIdParam = require('../middleware/validateIdParam.js');

// GET all notifications
router.get('/', notificationsController.getAllNotifications);

// POST a new notification
router.post('/', notificationsController.createNotification);

// DELETE a notification by ID
router.delete('/:id', validateIdParam("id"), notificationsController.deleteNotification);

module.exports = router;
