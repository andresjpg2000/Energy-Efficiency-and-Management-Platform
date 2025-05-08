const express = require('express');
const router = express.Router();
const energyProductions = require('../controllers/energy-productions.controller.js');

const auth = require('../middleware/auth.js');
const validateIdParam = require('../middleware/validateIdParam.js');

// Get all energy consumptions
router.get('/', energyProductions.getAllEnergyProductions);

// Add a new energy consumption
router.post('/', energyProductions.addEnergyProduction);

// Delete an energy consumption by ID
//router.delete('/:id', validateIdParam("id"), energyProductions.deleteEnergyConsumption);

module.exports = router;
