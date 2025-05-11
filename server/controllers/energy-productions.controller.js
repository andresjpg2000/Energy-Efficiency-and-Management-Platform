// Import the users data model
const e = require('cors');
const { EnergyProductions, EnergyEquipment, Housing } = require('../models/index.js');
const { Op } = require('sequelize');


// get all energy returns
let getAllEnergyProductions = async (req, res) => {

  if (!req.query.userId) {
    return res.status(400).json({
      message: "user ID is required",
    });
  }

  // vars
  let filterEnergy;
  let limit;
  let equipments = [];

  try {
    if (!req.query.equipmentId && !req.query.houseId) {  
      /// all user equipments
      equipments = await allUserEquipments(parseInt(req.query.userId));
    }else if (!req.query.equipmentId && req.query.houseId) {
      // equipments of a house
      equipments = await allequipmentsHouse(parseInt(req.query.houseId), parseInt(req.query.userId));
    } else if (req.query.equipmentId && !req.query.houseId) {
      // one equipment
      const eq = await EnergyEquipment.findOne({
        where: {
          id_equipment: parseInt(req.query.equipmentId),
        }
      });
      if (!eq) {
        return res.status(404).json({   
          message: "Equipment not found",
        });
      }
      const hs = await Housing.findOne({
        where: {
          id_housing: eq.housing,
          id_user: parseInt(req.query.userId)
        }
      });
      
      if (!hs) {
        return res.status(403).json({
          message: "House does not belong to the user",
        });
      }

      equipments.push(parseInt(req.query.equipmentId),);
    }else{
      return res.status(400).json({
        message: "cant use user ID and house ID at the same time",
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving energy returns",
      error: error.message,
    });
    
  }

  // check if start and end dates are provided in the query parameters
  // if they are, check if they are valid dates
  let start = req.query.start ? new Date(req.query.start) : new Date(0);
  let end = req.query.end ? new Date(req.query.end) : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      message: "Invalid date format",
    });
  }
  if (start > end) {
    return res.status(400).json({
      message: "The param end must be after than the param start!",
    });
  }

  // check if limit is provided in the query parameters
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
    if (isNaN(limit)) {
      return res.status(400).json({
        message: "Limit must be a number",
      });
    }
    if (limit < 0) {
      return res.status(400).json({
        message: "Limit must be a more than 0 items",
      });
    }
  }
  try {
    //query the database for the energy returns
    filterEnergy = await EnergyProductions.findAll({
      where: {
        id_equipment: {
          [Op.in]: equipments
        },
        date: {
          [Op.and]: [
            { [Op.gte]: start },
            { [Op.lte]: end }
          ]
        }
      },
      limit: limit || null,
      order: [['date', 'ASC']]
    });
  }catch(err){
    return res.status(500).json({
      message: "Error retrieving energy returns",
      error: err.message,
    });
  }

  if (filterEnergy.length == 0) {
    return res.status(404).json({
      message: "No energy returns found",
    });
  } else {
    return res.status(200).json({
      message: "Energy returns found",
      data: filterEnergy,
    });
  }
}

let addEnergyProduction = async (req, res) => {
  const { id_equipment, date, value } = req.body;

  if (!id_equipment || !date || !value) {
    return res.status(400).json({
      message: " Equipament ID, Date and Value are required",
    });
  }

  if (isNaN(id_equipment) || isNaN(value)) {
    return res.status(400).json({
      message: "House ID, Equipament ID and Value must be numbers",
    });
  }

  if (id_equipment < 0 || value < 0) {
    return res.status(400).json({
      message: "House ID, Equipament ID and Value must be positive numbers",
    });
  }

  let finalDate = date ? new Date(date) : new Date();

  if (isNaN(finalDate.getTime())) {
    return res.status(400).json({
      message: "Invalid date format",
    });
  }

  let newEnergyProd = {
    value,
    id_equipment,
    date: finalDate,
  };
  try{
    const createdEnergyReturn = await EnergyProductions.create(newEnergyProd);

    res.status(201).json({
      message: "Energy return created",
      data: createdEnergyReturn,
    });
  }catch(err){
    res.status(500).json({
      message: "Error creating energy return",
      error: err.message,
    });
  }
}

let deleteEnergyProduction = async (req, res, next) => {
  try {
    const id  = parseInt(req.params.id);

    const energy = await EnergyProductions.findByPk(id);
    if (!energy) {
      return res.status(404).json({ message: "Energy not found." });
    }

    await energy.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Error creating energy return",
      error: error.message,
    });
  }
}

async function allUserEquipments(user)  {
  const houses = await Housing.findAll({
    where: {
      id_user: user
    }
  });

  const houseIds = houses.map(h => h.id_housing);

  let equipments = await EnergyEquipment.findAll({
    where: {
      housing: {
        [Op.in]: houseIds
      },
    }
  });

  equipments = equipments.map(e => e.id_equipment);


  return equipments;
}

async function allequipmentsHouse(house,user)  {
  const hs = await Housing.findOne({
    where: {
      id_housing: house,
      id_user: user
    }
  }); 
  if (!hs) {
    const error = new Error("House does not belong to the user");
    error.statusCode = 403;
    throw error;
  }
  const equipments = await EnergyEquipment.findAll({
    where: {
      housing: house
    }
  });
  const equipmentIds = equipments.map(e => e.id_equipment);
  
  return equipmentIds;
}


module.exports = {
    getAllEnergyProductions,
    addEnergyProduction,
    deleteEnergyProduction,
};
