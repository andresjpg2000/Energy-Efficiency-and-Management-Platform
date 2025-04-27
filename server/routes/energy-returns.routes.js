

const express = require('express');
const router = express.Router();

const energyReturnsController = require('../controllers/energy-returns.controll.js');
//const { verifyToken } = require('../middleware/auth.middleware.js');

router.get('/', energyReturnsController.getEnergyReturns);

router.post('/', energyReturnsController.addEnergyReturn);

module.exports = router;