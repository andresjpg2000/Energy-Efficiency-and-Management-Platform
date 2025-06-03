const express = require('express');
const router = express.Router();
const authController = require('../controllers/users.auth.controller.js');
const authenticate = require('../middleware/auth.js');

router.post("/register", authController.register);

router.post('/login', authController.login);

router.post('/verify-2fa', authController.verify2FA);

router.post('/refresh-token', authController.refreshToken);

router.get('/me', authenticate, authController.getUserInfo);

router.post('/reset-password-email', authController.resetPasswordEmail);

router.post('/reset-password', authController.resetPassword);

module.exports = router;