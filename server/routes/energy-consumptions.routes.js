const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access housing ID in the routes
const consumptionsController = require('../controllers/energy-consumptions.controller.js');

const auth = require('../middleware/auth.js');
const validateIdParam = require('../middleware/validateIdParam.js');
const verifyOwnership = require('../middleware/verifyOwnership.js');

// All the routes apply to a specific housing - admin doesnt have access to user consumptions

// Get all energy consumptions
// router.get('/housings/:id_housing/energy-consumptions', auth(), verifyOwnership, consumptionsController.getAllEnergyConsumptions);

// Get an energy consumption by ID
// router.get('/:id_consumption', auth(), verifyOwnership, validateIdParam("id_consumption"), consumptionsController.getEnergyConsumptionById);

// Add a new energy consumption
router.post('/', auth(), verifyOwnership, consumptionsController.addEnergyConsumption);

// Delete an energy consumption by ID
router.delete('/:id_consumption', auth(), verifyOwnership, validateIdParam("id_consumption"), consumptionsController.deleteEnergyConsumption);

module.exports = router;