const { EnergyConsumption } = require('../models/index.js');
const { UniqueConstraintError, ValidationError } = require('sequelize');

// Create consumption
const addEnergyConsumption = async (req, res, next) => {
    if (!req.body || !req.body.value || !req.body.date || !req.body.id_supplier) {
        return res.status(400).json({ message: 'Value, date and supplier are required!' });
    }
    
    try {
        const newConsumption = await EnergyConsumption.create({
            value: req.body.value,
            date: req.body.date,
            id_supplier: req.body.id_supplier,
            id_housing: req.params.id_housing,
        });

        res.status(201).json({
            data: newConsumption,
            links: [
                {
                    rel: 'self',
                    href: `/energy-consumptions`,
                    method: 'POST',
                },
                {
                    rel: 'get-by-id',
                    href: `/energy-consumptions/${newConsumption.id_consumption}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/energy-consumptions`,
                    method: 'GET',
                },
                {
                    rel: 'update',
                    href: `/energy-consumptions/${newConsumption.id_consumption}`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/energy-consumptions/${newConsumption.id_consumption}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/energy-consumptions/${newConsumption.id_consumption}`,
                    method: 'DELETE',
                },
            ],            
        });
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error creating consumption:", err);

        // Handle specific db.Sequelize validation errors and join them into a single message
        if (err instanceof ValidationError) {
            return res.status(400).json({
                message: err.errors.map(err => err.message).join(', ')
            });
        }
        // Handle unique constraint errors
        if (err instanceof UniqueConstraintError) {
            return res.status(400).json({
                message: "Consumption already exists!",
            });
        }
        // Handle other errors
        next(err);
    }
}

// Get all consumptions
const getAllEnergyConsumptions = async (req, res, next) => {
    try {
        const consumptions = await EnergyConsumption.findAll({
            where: {
                id_housing: req.params.id_housing,
            },
            order: [['date', 'DESC']],
        });
        res.status(200).json({
            data: consumptions,
            links: [
                {
                    rel: 'self',
                    href: `/energy-consumptions`,
                    method: 'GET',
                },
                {
                    rel: 'create',
                    href: `/energy-consumptions`,
                    method: 'POST',
                },
            ],
        });
    } catch (err) {
        console.error("Error fetching consumptions:", err);
        next(err);
    }
}

// Get consumption by ID
const getEnergyConsumptionById = async (req, res, next) => {
    try {        
        const consumption = await EnergyConsumption.findByPk(req.params.id_consumption);
        if (!consumption) {
            return res.status(404).json({ message: 'Consumption not found!' });
        }

        res.status(200).json({
            data: consumption,
            links: [
                {
                    rel: 'self',
                    href: `/energy-consumptions/${req.params.id_consumption}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/energy-consumptions`,
                    method: 'GET',
                },
                {
                    rel: 'update',
                    href: `/energy-consumptions/${req.params.id_consumption}`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/energy-consumptions/${req.params.id_consumption}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/energy-consumptions/${req.params.id_consumption}`,
                    method: 'DELETE',
                },
            ],
        });
    } catch (err) {
        console.error("Error fetching consumption by ID:", err);
        next(err);
    }
}

// Delete consumption
const deleteEnergyConsumption = async (req, res, next) => {
    try {
        const consumption = await EnergyConsumption.findByPk(req.params.id_consumption);
        if (!consumption) {
            return res.status(404).json({ message: 'Consumption not found!' });
        }

        await consumption.destroy();

        res.status(204).json({
            message: 'Consumption deleted successfully!',
            links: [
                {
                    rel: 'self',
                    href: `/energy-consumptions/${req.params.id_consumption}`,
                    method: 'DELETE',
                },
                {
                    rel: 'get-all',
                    href: `/energy-consumptions`,
                    method: 'GET',
                },
            ],
        });
    } catch (err) {
        console.error("Error deleting consumption:", err);
        next(err);
    }
}

module.exports = {
    addEnergyConsumption,
    getAllEnergyConsumptions,
    getEnergyConsumptionById,
    deleteEnergyConsumption,
};