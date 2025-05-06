const { Housing } = require('../models/index.js');
const { ValidationError, UniqueConstraintError } = require('sequelize');

// Get all housings
const getAllHousings = async (req, res, next) => {
    try {
        const housings = await Housing.findAll();

        if (!housings || housings.length === 0) {
            return res.status(404).json({ message: 'No housings found!' });
        }

        res.status(200).json({
            data: housings,
            links: [
              {
                rel: 'self',
                href: `/housings`,
                method: 'GET',
            },
              {
                  rel: 'get-by-id',
                  href: `/housings/:id_housing`,
                  method: 'GET',
              },
              {
                  rel: 'create',
                  href: `/housings`,
                  method: 'POST',
              },
              {
                  rel: 'update',
                  href: `/housings/:id_housing`,
                  method: 'PUT',
              },
              {
                  rel: 'partial-update',
                  href: `/housings/:id_housing`,
                  method: 'PATCH',
              },
              {
                  rel: 'delete',
                  href: `/housings/:id_housing`,
                  method: 'DELETE',
              },
          ],          
        });
    } catch (err) {
        console.error('Error fetching housings:', err);

        next(err);
    }
}

// Get a housing by ID
const getHousingById = async (req, res, next) => {
    try {
        // Validate the ID parameter to prevent SQL injection attacks
        if (!req.params.id_housing || isNaN(req.params.id_housing)) {
            return res.status(400).json({ message: 'Invalid ID parameter!' });
        }

        const housing = await Housing.findByPk(req.params.id_housing);

        if (!housing) {
            return res.status(404).json({ message: 'Housing not found!' });
        }
        // Check if the user is the owner of the housing - user authentication not implemented yet
        // if (req.user.id_user !== housing.id_user) {
        //   return res.status(403).json({ message: 'You are not authorized to access this housing!' });
        // }

        res.status(200).json({
            data: housing,
            links: [
                {
                    rel: 'self',
                    href: `/housings/${housing.id_housing}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/housings`,
                    method: 'GET',
                },
                {
                    rel: 'create',
                    href: `/housings`,
                    method: 'POST',
                },
                {
                    rel: 'update',
                    href: `/housings/${housing.id_housing}`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/housings/${housing.id_housing}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/housings/${housing.id_housing}`,
                    method: 'DELETE',
                },
            ],            
        });
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error fetching housing:", err);

        next(err);
    }
}

// Create a new housing
const createHousing = async (req, res, next) => {
    try {
        // Get the user ID from the authenticated user - not implemented yet
        const userID = req.user.id_user;
      
        const newHousing = await Housing.create({
            address,
            pc,
            building_type,
            id_user: userID,
        });

        res.status(201).json({
            data: newHousing,
            links: [
                {
                    rel: 'self',
                    href: `/housings`,
                    method: 'POST',
                },
                {
                    rel: 'get-by-id',
                    href: `/housings/${newHousing.id_housing}`,
                    method: 'GET',
                },
                {
                    rel: 'get-all',
                    href: `/housings`,
                    method: 'GET',
                },
                {
                    rel: 'update',
                    href: `/housings/${newHousing.id_housing}`,
                    method: 'PUT',
                },
                {
                    rel: 'partial-update',
                    href: `/housings/${newHousing.id_housing}`,
                    method: 'PATCH',
                },
                {
                    rel: 'delete',
                    href: `/housings/${newHousing.id_housing}`,
                    method: 'DELETE',
                },
            ],            
        });
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error creating housing:", err);

        // Handle specific db.Sequelize validation errors and join them into a single message
        if (err instanceof ValidationError) {
            return res.status(400).json({
                message: err.errors.map(err => err.message).join(', ')
            });
        }
        // Handle unique constraint errors
        if (err instanceof UniqueConstraintError) {
            return res.status(400).json({
                message: "Housing already exists!",
            });
        }
        // Handle other errors
        next(err);
    }
}

const updateHousing = async (req, res, next) => {
    try {
        const [affectedRows] = await Housing.update(req.body, {
            where: {
                id_housing: req.params.id_housing,
                // id_user: req.user.id_user, // Uncomment this line if you want to check user ownership
            },
        });

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Housing not found or unauthorized' });
        }

        res.status(200).json({
            message: `Housing with ID ${req.params.id_housing} updated successfully!`,
            links: [
                { 
                    rel: 'self', 
                    href: `/housings/${req.params.id}`,
                    method: 'PUT' 
                },
                { 
                    rel: 'get-by-id',
                    href: `/housings/${req.params.id}`,
                    method: 'GET' 
                },
                { 
                    rel: 'get-all',
                    href: `/housings`, 
                    method: 'GET' 
                },
                {
                    rel: 'create',
                    href: `/housings`, 
                    method: 'POST' 
                },
                {
                    rel: 'partial-update',
                    href: `/housings/${req.params.id}`,
                    method: 'PATCH' 
                },
                {
                    rel: 'delete',
                    href: `/housings/${req.params.id}`,
                    method: 'DELETE' 
                },
            ]
        });
    } catch (err) {
        console.error("Error updating housing:", err);

        if (err instanceof ValidationError) {
            return res.status(400).json({
                message: err.errors.map(err => err.message).join(', ')
            });
        }
        if (err instanceof UniqueConstraintError) {
            return res.status(400).json({
                message: "Housing already exists!",
            });
        }
        next(err);
    }
}


// Partially update a housing by ID
const partialUpdateHousing = async (req, res, next) => {
  try {

    const [affectedRows] = await Housing.update(req.body, {
        where: {
            id_housing: req.params.id_housing,
            // id_user: req.user.id_user, // Uncomment this line if you want to check user ownership
        },
    });

    if (affectedRows === 0) {
        return res.status(404).json({ message: 'Housing not found or unauthorized' });
    }

    res.status(200).json({
        message: `Housing with ID ${req.params.id_housing} updated successfully!`,
        links: [
            {
                rel: 'self',
                href: `/housings/${req.params.id_housing}`,
                method: 'PATCH',
            },
            {
                rel: 'get-by-id',
                href: `/housings/${req.params.id_housing}`,
                method: 'GET',
            },
            {
                rel: 'get-all',
                href: `/housings`,
                method: 'GET',
            },
            {
                rel: 'create',
                href: `/housings`,
                method: 'POST',
            },
            {
                rel: 'update',
                href: `/housings/${req.params.id_housing}`,
                method: 'PUT',
            },
            {
                rel: 'delete',
                href: `/housings/${req.params.id_housing}`,
                method: 'DELETE',
            },
        ],            
    });
  } catch (err) {
      // Handle any errors that occur during the database query
      console.error("Error patching housing:", err);

      // Handle specific Sequelize validation errors and join them into a single message
      if (err instanceof ValidationError) {
          return res.status(400).json({
              message: err.errors.map(err => err.message).join(', ')
          });
      }
      // Handle unique constraint errors
      if (err instanceof UniqueConstraintError) {
          return res.status(400).json({
              message: "Housing already exists!",
          });
      }
      // Handle other errors
      next(err);
  }
}

// Delete a housing by ID
const deleteHousing = async (req, res, next) => {
    try {
        
        const affectedRows = await Housing.destroy({
            where: {
                id_housing: req.params.id_housing,
                // id_user: req.user.id_user, // Uncomment this line if you want to check user ownership
            },
        });

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Housing not found!' });
        }

        // Check if the user is the owner of the housing
        // if (req.user.id_user !== housing.id_user) {
        //   return res.status(403).json({ message: 'You are not authorized to access this housing!' });
        // }

        res.status(204).json({
            message: `Housing with ID ${req.params.id_housing} deleted successfully!`,          
        });

    } catch (err) {
        // Handle any errors that occur during the database query
        console.error("Error deleting housing:", err);

        next(err);
    }
}

module.exports = {
    getAllHousings,
    getHousingById,
    createHousing,
    updateHousing,
    partialUpdateHousing,
    deleteHousing,
};