const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliers.controller.js');

const auth = require('../middleware/auth.js');
const authorizeAdmin = require('../middleware/authorizeAdmin.js');
const validateParamIsInt = require('../middleware/validateIdParam.js'); 

// GET /suppliers - Get all suppliers
router.get('/', suppliersController.getAllSuppliers);

// GET /suppliers/:id - Get a supplier by ID
router.get('/:id', validateParamIsInt("id"), suppliersController.getSupplierById);

// POST /suppliers - Create a new supplier
router.post('/', auth, authorizeAdmin, suppliersController.createSupplier);

// PUT /suppliers/:id - Update a supplier by ID
router.put('/:id', auth, authorizeAdmin, validateParamIsInt("id"), suppliersController.updateSupplier);

// PATCH /suppliers/:id - Partially update a supplier by ID
router.patch('/:id', auth, authorizeAdmin, validateParamIsInt("id"), suppliersController.partialUpdateSupplier);

// Delete /suppliers/:id - Delete a supplier by ID
router.delete('/:id', auth, authorizeAdmin, validateParamIsInt("id"), suppliersController.deleteSupplier);

module.exports = router;

