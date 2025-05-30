const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const authenticate = require('../middleware/auth.js');

router.post('/login', authController.login); 

router.post('/refresh-token', authController.refreshToken);

router.get('/me', authenticate, authController.getUserInfo);

router.post('/reset-password-email', authController.resetPasswordEmail);

router.post('/reset-password', authController.resetPassword);

module.exports = router;