const express = require('express');
const router = express.Router();
const consumptionsController = require('../controllers/energy-consumptions.controller.js');

const auth = require('../middleware/auth.js');
const validateIdParam = require('../middleware/validateIdParam.js');

// Get all energy consumptions
router.get('/', consumptionsController.getAllEnergyConsumptions);

// Add a new energy consumption
router.post('/', consumptionsController.addEnergyConsumption);

// Delete an energy consumption by ID
router.delete('/:id', validateIdParam("id"), consumptionsController.deleteEnergyConsumption);

module.exports = router;