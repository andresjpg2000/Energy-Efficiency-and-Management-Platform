const express = require('express');
const router = express.Router();
const housingsController = require('../controllers/housings.controller.js');

const auth = require('../middleware/auth.js');
const validateIdParam = require('../middleware/validateIdParam.js');
const authorizeAdmin = require('../middleware/authorizeAdmin.js'); 

// Get all housings
router.get('/', auth, authorizeAdmin, housingsController.getAllHousings);

// Get a housing by ID
router.get('/:id_housing', auth, validateIdParam("id_housing"), housingsController.getHousingById);

// Create a new housing
router.post('/', auth, housingsController.createHousing);

// Update a housing by ID
router.put('/:id_housing', auth, validateIdParam("id_housing"), housingsController.updateHousing);

// Partially update a housing by ID
router.patch('/:id_housing', auth, validateIdParam("id_housing"), housingsController.partialUpdateHousing);

// Delete a housing by ID
router.delete('/:id_housing', auth, validateIdParam("id_housing"), housingsController.deleteHousing);

module.exports = router;