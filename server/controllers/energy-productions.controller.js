// Import the users data model
const { EnergyProductions, EnergyEquipment } = require('../models/index.js');
const { Op } = require('sequelize');


// get all energy returns
let getAllEnergyProductions = async (req, res) => {
  // check if houseId is provided in the query parameters
  if (!req.query.houseId) {
    return res.status(400).json({
      message: "House ID is required",
    });
  }
  // vars
  let filterEnergy;
  let userId = parseInt(req.query.userId); // TOKEN VERIFICAR AQUI
  let houseId = parseInt(req.query.houseId);
  let limit;
  let equipments = [];

  // check if houseId is a number and positive
  if (isNaN(houseId)) {
    return res.status(400).json({
      message: "House ID must be a number",
    });
  }
  if (houseId < 0) {
    return res.status(400).json({
      message: "House ID must be a positive number",
    });
  }

  // check if equipmentId is provided in the query parameters
  // if it is, check if it is a number and positive
  try {
    if (req.query.equipmentId) {
        if (isNaN(parseInt(req.query.equipmentId))) {
          return res.status(400).json({
            message: "Equipament ID must be a number",
          });
        }
        if (parseInt(req.query.equipmentId) < 0) {
          return res.status(400).json({
            message: "Equipament ID must be a positive number",
          });
        }
        equipments.push(parseInt(req.query.equipmentId));
      } else {
        let equips = await EnergyEquipment.findAll({
          where: {
            housing: houseId
          }
        });
        equips.forEach(eq => {
          equipments.push(parseInt(eq.id_equipment));
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


module.exports = {
    getAllEnergyProductions,
    addEnergyProduction,
    deleteEnergyProduction,
};
