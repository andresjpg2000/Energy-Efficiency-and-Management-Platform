// Import the suppliers model
const db = require('../models/index.js');
const Suppliers = db.Suppliers; 

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        // Fetch all suppliers from the database
        const suppliers = await Suppliers.findAll();
        // Check if suppliers were found
        if (suppliers.length === 0) {
            return res.status(404).json({
                message: "No suppliers found!",
            });
        }
        // Send a response with the suppliers data
        res.status(200).json({
            data: suppliers,
            links: [{
                rel: 'add',
                href: '/energy-provided',
                method: 'ADD',
            }],
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error fetching suppliers:", error);
        res.status(500).json({
            message: "Internal server error!",
        });
    }
}

// Post a new supplier
let createSupplier = (req, res) => {
    // Check if the request body is empty
    if (!req.body) {
        return res.status(400).json({
            message: "Content cannot be empty!",
        });
    }

    // Create a new supplier object
    const newSupplier = {
        id: suppliers.length + 1,
        enterprise: req.body.enterprise,
        cost_kWh: req.body.cost_kWh,
    };

    // Add the new supplier to the suppliers array
    suppliers.push(newSupplier);

    // Send a response with the created supplier
    res.status(201).json({
        data: newSupplier,
        links: [{
            rel: 'self',
            href: `/suppliers/${newSupplier.id}`,
            method: 'GET',
        }],
    });
}

// Put update a supplier
let updateSupplier = (req, res) => {
    // Check if the request body is empty
    if (!req.body) {
        return res.status(400).json({
            message: "Content cannot be empty!",
        });
    }

    // Find the supplier by ID
    const supplier = suppliers.find(s => s.id === parseInt(req.params.id));
    if (!supplier) {
        return res.status(404).json({
            message: `Supplier with ID ${req.params.id} not found!`,
        });
    }

    // Update the supplier's properties
    supplier.enterprise = req.body.enterprise;
    supplier.cost_kWh = req.body.cost_kWh;

    // Send a response with the updated supplier
    res.status(200).json({
        data: supplier,
        links: [{
            rel: 'self',
            href: `/suppliers/${supplier.id}`,
            method: 'GET',
        }],
    });
}

// Delete a supplier
let deleteSupplier = (req, res) => {
    // Find the supplier by ID
    const supplierIndex = suppliers.findIndex(s => s.id === parseInt(req.params.id));
    if (supplierIndex === -1) {
        return res.status(404).json({
            message: `Supplier with ID ${req.params.id} not found!`,
        });
    }

    // Remove the supplier from the suppliers array
    suppliers.splice(supplierIndex, 1);

    // Send a response indicating successful deletion
    res.status(200).json({
        message: `Supplier with ID ${req.params.id} deleted successfully!`,
    });
}

module.exports = {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};