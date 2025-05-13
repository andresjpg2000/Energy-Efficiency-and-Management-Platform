const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const authenticate = require('../middleware/auth.js');

router.post('/login', authController.login); 

router.get('/me', authController.getUserInfo);

router.post('/logout', authController.logout);

module.exports = router;