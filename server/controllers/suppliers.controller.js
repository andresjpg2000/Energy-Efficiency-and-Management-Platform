// Import the suppliers model
const db = require('../models/index.js');
const Suppliers = db.Supplier; 

// Get all suppliers
const getAllSuppliers = async (req, res, next) => {
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
                    rel: 'self',
                    href: `/suppliers`,
                    method: 'GET',
                },
                {
                    rel: 'get-by-id',
                    href: `/suppliers/:id`,
                    method: 'GET',
                },
                {
                    rel: 'create',
                    href: `/suppliers`,
                    method: 'POST',
                },
                {
                    rel: 'update',
                    href: `/suppliers/:id`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/suppliers/:id`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/:id`,
                    method: 'DELETE',
                },
            ],
        });
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error fetching suppliers:", err);
        next(err);
    }
}

// Get a supplier by ID
const getSupplierById = async (req, res, next) => {
    try {
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
                    href: `/suppliers/${supplier.id}`,
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
                    href: `/suppliers/${supplier.id}`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/suppliers/${supplier.id}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/${supplier.id}`,
                    method: 'DELETE',
                },
            
            ],
        });
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error fetching suppliers:", err);
        next(err);
    }
}

// Post a new supplier
const createSupplier = async (req, res, next) => {
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
                    href: `/suppliers/${createdSupplier.id}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/suppliers`,
                    method: 'GET',
                },
                {
                    rel: 'update',
                    href: `/suppliers/${createdSupplier.id}`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/suppliers/${createdSupplier.id}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/${createdSupplier.id}`,
                    method: 'DELETE',
                },
            
            ],
        });
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error creating supplier:", err);

        // Handle specific Sequelize validation errors and join them into a single message
        if (err instanceof db.Sequelize.ValidationError) {
            return res.status(400).json({
                message: err.errors.map(err => err.message).join(', ')
            });
        }
        // Handle unique constraint errors
        if (err instanceof db.Sequelize.UniqueConstraintError) {
            return res.status(400).json({
                message: "Supplier already exists!",
            });
        }
        // Handle other errors
        next(err);
    }
}

// Put update a supplier
const updateSupplier = async (req, res, next) => {
    // Find the supplier by ID
    const supplier = await Suppliers.findByPk(req.params.id);
    if (!supplier) {
        return res.status(404).json({
            message: `Supplier with ID ${req.params.id} not found!`,
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
            message: `Supplier with ID ${supplier.id} updated successfully!`,
            links: [
                {
                    rel: 'self',
                    href: `/suppliers/${supplier.id}`,
                    method: 'PUT',
                },
                {
                    rel: 'get-by-id',
                    href: `/suppliers/${supplier.id}`,
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
                    href: `/suppliers/${supplier.id}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/${supplier.id}`,
                    method: 'DELETE',
                },
            
            ],
        });
    } catch (err) {
         // Handle any errors that occur during the database query
         console.error("Error creating supplier:", err);

         // Handle specific Sequelize validation errors and join them into a single message
         if (err instanceof db.Sequelize.ValidationError) {
             return res.status(400).json({
                 message: err.errors.map(err => err.message).join(', ')
             });
         }
         // Handle unique constraint errors
         if (err instanceof db.Sequelize.UniqueConstraintError) {
             return res.status(400).json({
                 message: "Supplier already exists!",
             });
         }
         // Handle other errors
         next(err);
    }
}

// Partially update a supplier
const partialUpdateSupplier = async (req, res, next) => {
    // Find the supplier by ID
    const supplier = await Suppliers.findByPk(req.params.id);
    if (!supplier) {
        return res.status(404).json({
            message: `Supplier with ID ${req.params.id} not found!`,
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
            message: `Supplier with ID ${supplier.id} partially updated successfully!`,
            links: [
                {
                    rel: 'self',
                    href: `/suppliers/${supplier.id}`,
                    method: 'PATCH',
                },
                {
                    rel: 'get-by-id',
                    href: `/suppliers/${supplier.id}`,
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
                    href: `/suppliers/${supplier.id}`,
                    method: 'PUT',
                },
                {
                    rel: 'delete',
                    href: `/suppliers/${supplier.id}`,
                    method: 'DELETE',
                },
            
            ],
        });
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error creating supplier:", err);

        // Handle specific Sequelize validation errors and join them into a single message
        if (err instanceof db.Sequelize.ValidationError) {
            return res.status(400).json({
                message: err.errors.map(err => err.message).join(', ')
            });
        }
        // Handle unique constraint errors
        if (err instanceof db.Sequelize.UniqueConstraintError) {
            return res.status(400).json({
                message: "Supplier already exists!",
            });
        }
        // Handle other errors
        next(err);
    }
}

// Delete a supplier
const deleteSupplier = async (req, res, next) => {
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
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error deleting supplier:", err);
        
        next(err);
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