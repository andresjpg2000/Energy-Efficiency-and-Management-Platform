const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliers.controller.js');

// GET /suppliers - Get all suppliers
router.get('/', suppliersController.getAllSuppliers);

// POST /suppliers - Create a new supplier
router.post('/', suppliersController.createSupplier);

// PUT /suppliers/:id - Update a supplier by ID
router.put('/:id', suppliersController.updateSupplier);

// Delete /suppliers/:id - Delete a supplier by ID
router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;

