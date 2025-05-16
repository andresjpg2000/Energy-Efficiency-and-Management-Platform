const { EnergyConsumption, Housing } = require('../models/index.js');
const { UniqueConstraintError, ValidationError } = require('sequelize');

// Create consumption
const addEnergyConsumption = async (req, res, next) => {
    if (!req.body || !req.body.value || !req.body.date || !req.body.id_housing) {
        return res.status(400).json({ message: 'value, date and id_housing are required!' });
    }
    
    const id_housing = req.body.id_housing;
    const id_user = req.user.id_user;

    try {
        // Check if the housing belongs to the user
        const housing = await Housing.findOne({
            where: {
                id_housing,
                id_user,
            },
        });

        if (!housing ) {
            return res.status(403).json({ message: 'You do not have access to this housing.' });
        }

    } catch (error) {
        console.error('Error verifying ownership:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }

    try {
        const newConsumption = await EnergyConsumption.create({
            value: req.body.value,
            date: req.body.date,
            id_housing: req.body.id_housing,
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

// Delete consumption
const deleteEnergyConsumption = async (req, res, next) => {
    try {
        const response = await EnergyConsumption.destroy({
            where: {
                id_consumption: req.params.id_consumption,
            },
        });

        if (!response) {
            return res.status(404).json({ message: 'Consumption not found!' });
        }

        res.status(204).json({
            message: 'Consumption deleted successfully!',
            links: [
                {
                    rel: 'self',
                    href: `/energy-consumptions/${req.params.id_consumption}`,
                    method: 'DELETE',
                },
                {
                    rel: 'create',
                    href: `/energy-consumptions`,
                    method: 'POST',
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
    deleteEnergyConsumption,
};