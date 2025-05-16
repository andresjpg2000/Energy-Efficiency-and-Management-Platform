const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access housing ID in the routes
const consumptionsController = require('../controllers/energy-consumptions.controller.js');
const auth = require('../middleware/auth.js');
const validateIdParam = require('../middleware/validateIdParam.js');

// Add a new energy consumption
router.post('/', auth(), consumptionsController.addEnergyConsumption);
// Delete an energy consumption by ID - only admins can delete
router.delete('/:id_consumption', auth(true), validateIdParam("id_consumption"), consumptionsController.deleteEnergyConsumption);

module.exports = router;