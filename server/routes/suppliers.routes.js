const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliers.controller.js');

// GET /suppliers - Get all suppliers
router.get('/', suppliersController.getAllSuppliers);

// GET /suppliers/:id - Get a supplier by ID
router.get('/:id', suppliersController.getSupplierById);

// POST /suppliers - Create a new supplier
router.post('/', suppliersController.createSupplier);

// PUT /suppliers/:id - Update a supplier by ID
router.put('/:id', suppliersController.updateSupplier);

// PATCH /suppliers/:id - Partially update a supplier by ID
router.patch('/:id', suppliersController.partialUpdateSupplier);

// Delete /suppliers/:id - Delete a supplier by ID
router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;

