const express = require('express');
const router = express.Router();
const housingsController = require('../controllers/housings.controller.js');
const auth = require('../middleware/auth.js'); // Trocar para o middleware de autenticação real

// Get all housings
router.get('/', housingsController.getAllHousings);

// Get a housing by ID
router.get('/:id_housing', housingsController.getHousingById);

// Create a new housing
router.post('/', housingsController.createHousing);

// Update a housing by ID
router.put('/:id_housing', housingsController.updateHousing);

// Partially update a housing by ID
router.patch('/:id_housing', housingsController.partialUpdateHousing);

// Delete a housing by ID
router.delete('/:id_housing', housingsController.deleteHousing);

module.exports = router;