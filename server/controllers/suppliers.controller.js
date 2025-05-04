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
            links: [
                {
                rel: 'add',
                href: '/suppliers',
                method: 'POST',
                },
            ],
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error fetching suppliers:", error);
        res.status(500).json({
            message: "Internal server error!",
        });
    }
}

// Get a supplier by ID
const getSupplierById = async (req, res) => {
    try {
        // Fetch all suppliers from the database
        const suppliers = await Suppliers.findAll();
        // Find the supplier by ID
        const supplier = await Suppliers.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({
                message: `Supplier with ID ${req.params.id} not found!`,
            });
        }
        // Send a response with the suppliers data
        res.status(200).json({
            data: supplier,
            links: [
                {
                    rel: 'self',
                    href: `/suppliers/${req.params.id}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/suppliers`,
                    method: 'GET',
                },
                {
                    rel: 'create',
                    href: `/suppliers`,
                    method: 'POST',
                },
                {
                    rel: 'update',
                    href: `/suppliers/${req.params.id}`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/suppliers/${req.params.id}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/${req.params.id}`,
                    method: 'DELETE',
                },
            
            ],
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
const createSupplier = async (req, res) => {
    // Check if the request body is empty
    if (!req.body) {
        return res.status(400).json({
            message: "Content cannot be empty!",
        });
    }
    // Check if the supplier already exists
    const existingSupplier = await Suppliers.findOne({ where: { enterprise: req.body.enterprise } });
    if (existingSupplier) {
        return res.status(400).json({
            message: `Supplier with enterprise ${req.body.enterprise} already exists!`,
        });
    }
    // Check if the cost_kWh is a valid number
    if (isNaN(req.body.cost_kWh) || req.body.cost_kWh <= 0) {
        return res.status(400).json({
            message: "cost_kWh must be a valid number!",
        });
    }
    // Check if the enterprise name is valid
    if (typeof req.body.enterprise !== 'string' || req.body.enterprise.trim() === '' || req.body.enterprise.length > 45) {
        return res.status(400).json({
            message: "enterprise must be a valid string and can't have more than 45 characters!",
        });
    }

    // Create a new supplier object
    const newSupplier = {
        enterprise: req.body.enterprise,
        cost_kWh: req.body.cost_kWh,
    };

    try {
        // Add the new supplier to the database
        const createdSupplier = await Suppliers.create(newSupplier);
        // Send a response with the created supplier
        res.status(201).json({
            data: createdSupplier,
            message: "Supplier created successfully!",
            links: [
                {
                    rel: 'self',
                    href: `/suppliers`,
                    method: 'POST',
                },
                {
                    rel: 'get-by-id',
                    href: `/suppliers/${req.params.id}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/suppliers`,
                    method: 'GET',
                },
                {
                    rel: 'update',
                    href: `/suppliers/${req.params.id}`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/suppliers/${req.params.id}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/${req.params.id}`,
                    method: 'DELETE',
                },
            
            ],
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error creating supplier:", error);
        res.status(500).json({
            message: "Internal server error!",
        });
    }
}

// Put update a supplier
const updateSupplier = async (req, res) => {
    // Check if the request body is empty
    if (!req.body) {
        return res.status(400).json({
            message: "Content cannot be empty!",
        });
    }

    // Find the supplier by ID
    const supplier = await Suppliers.findByPk(req.params.id);
    if (!supplier) {
        return res.status(404).json({
            message: `Supplier with ID ${req.params.id} not found!`,
        });
    }

    // Check if the supplier already exists
    const existingSupplier = await Suppliers.findOne({ where: { enterprise: req.body.enterprise } });
    if (existingSupplier && existingSupplier.id !== supplier.id) {
        // If the existing supplier is not the same as the one being updated, return an error
        return res.status(400).json({
            message: `Supplier with enterprise ${req.body.enterprise} already exists!`,
        });
    }
    // Check if the cost_kWh is a valid number
    if (isNaN(req.body.cost_kWh) || req.body.cost_kWh <= 0) {
        return res.status(400).json({
            message: "cost_kWh must be a valid number!",
        });
    }
    // Check if the enterprise name is valid
    if (typeof req.body.enterprise !== 'string' || req.body.enterprise.trim() === '' || req.body.enterprise.length > 45) {
        return res.status(400).json({
            message: "enterprise must be a valid string and can't have more than 45 characters!",
        });
    }

    // Update the supplier's properties
    supplier.enterprise = req.body.enterprise;
    supplier.cost_kWh = req.body.cost_kWh;

    try {
        // Save the updated supplier to the database
        await supplier.save();
        // Send a response with the updated supplier
        res.status(200).json({
            data: supplier,
            message: `Supplier with ID ${req.params.id} updated successfully!`,
            links: [
                {
                    rel: 'self',
                    href: `/suppliers/${req.params.id}`,
                    method: 'PUT',
                },
                {
                    rel: 'get-by-id',
                    href: `/suppliers/${req.params.id}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/suppliers`,
                    method: 'GET',
                },
                {
                    rel: 'create',
                    href: `/suppliers`,
                    method: 'POST',
                },
                {
                    rel: 'partial-update',
                    href: `/suppliers/${req.params.id}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/${req.params.id}`,
                    method: 'DELETE',
                },
            
            ],
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error updating supplier:", error);
        res.status(500).json({
            message: "Internal server error!",
        });
    }
}

// Partially update a supplier
const partialUpdateSupplier = async (req, res) => {
    // Check if the request body is empty
    if (!req.body) {
        return res.status(400).json({
            message: "Content cannot be empty!",
        });
    }

    // Find the supplier by ID
    const supplier = await Suppliers.findByPk(req.params.id);
    if (!supplier) {
        return res.status(404).json({
            message: `Supplier with ID ${req.params.id} not found!`,
        });
    }
    // Check if the supplier already exists
    const existingSupplier = await Suppliers.findOne({ where: { enterprise: req.body.enterprise } });
    if (existingSupplier && existingSupplier.id !== supplier.id) {
        // If the existing supplier is not the same as the one being updated, return an error
        return res.status(400).json({
            message: `Supplier with enterprise ${req.body.enterprise} already exists!`,
        });
    }
    // Check if the cost_kWh is a valid number
    if (isNaN(req.body.cost_kWh) || req.body.cost_kWh <= 0) {
        return res.status(400).json({
            message: "cost_kWh must be a valid number!",
        });
    }
    // Check if the enterprise name is valid
    if (typeof req.body.enterprise !== 'string' || req.body.enterprise.trim() === '' || req.body.enterprise.length > 45) {
        return res.status(400).json({
            message: "enterprise must be a valid string and can't have more than 45 characters!",
        });
    }

    // Update the supplier's properties based on the request body
    if (req.body.enterprise) {
        supplier.enterprise = req.body.enterprise;
    }
    if (req.body.cost_kWh) {
        supplier.cost_kWh = req.body.cost_kWh;
    }

    try {
        // Save the updated supplier to the database
        await supplier.save();
        // Send a response with the updated supplier
        res.status(200).json({
            data: supplier,
            message: `Supplier with ID ${req.params.id} partially updated successfully!`,
            links: [
                {
                    rel: 'self',
                    href: `/suppliers/${req.params.id}`,
                    method: 'PATCH',
                },
                {
                    rel: 'get-by-id',
                    href: `/suppliers/${req.params.id}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/suppliers`,
                    method: 'GET',
                },
                {
                    rel: 'create',
                    href: `/suppliers`,
                    method: 'POST',
                },
                {
                    rel: 'update',
                    href: `/suppliers/${req.params.id}`,
                    method: 'PUT',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/${req.params.id}`,
                    method: 'DELETE',
                },
            
            ],
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error partially updating supplier:", error);
        res.status(500).json({
            message: "Internal server error!",
        });
    }
}

// Delete a supplier
const deleteSupplier = async (req, res) => {
    // Find the supplier by ID
    const supplier = await Suppliers.findByPk(req.params.id);

    if (!supplier) {
        return res.status(404).json({
            message: `Supplier with ID ${req.params.id} not found!`,
        });
    }

    try {
        // Delete the supplier from the database
        await supplier.destroy();
        // Send a response indicating successful deletion
        res.status(204).json({
            message: `Supplier with ID ${req.params.id} deleted successfully!`,
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error deleting supplier:", error);
        res.status(500).json({
            message: "Internal server error!",
        });
    }
}

module.exports = {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    partialUpdateSupplier,
};