const db = require("../models/index.js");
const EnergyEquipment = db.EnergyEquipment;
const { Op } = require('sequelize');


// Listar todos os equipamentos
async function getAllEnergyEquipments(req, res, next) {
  try {
    const equipments = await EnergyEquipment.findAll();
    res.status(200).json({ data: equipments });
  } catch (error) {
    next(error);
  }
}

// Criar um novo equipamento
async function createEnergyEquipment(req, res, next) {
  try {
    const { energy_type, capacity, housing, name } = req.body;

    // Verificar se os campos obrigatórios estão presentes
    if (!energy_type || !capacity || !housing) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Criar o novo equipamento
    const newEquipment = await EnergyEquipment.create({
      energy_type,
      capacity,
      housing,
      name: name || null, // Permitir nome opcional
    });

    res
      .status(201)
      .json({
        message: "Equipment has been registered.",
        id_equipment: newEquipment.id_equipment,
      });
  } catch (error) {
    next(error);
  }
}

// Atualizar nome de um equipamento
async function updateEnergyEquipmentName(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const bodyKeys = Object.keys(req.body);
    if (!name || bodyKeys.length !== 1 || bodyKeys[0] !== "name") {
      return res
        .status(400)
        .json({ message: "The 'name' field is required and must be the only field in the request body." }); 
    }

    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: "The name must have at least 3 characters." });
    }

    const equipment = await EnergyEquipment.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    await equipment.update({ name });
    res
      .status(200)
      .json({ message: "The name has been successfully changed." });
  } catch (error) {
    next(error);
  }
}

// Eliminar um equipamento
async function deleteEnergyEquipment(req, res, next) {
  try {
    const { id } = req.params;

    const equipment = await EnergyEquipment.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    await equipment.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Get given energy by equipment
async function getGivenEnergyOfEquipment(req, res, next) {
  try {
    // Get the equipment by ID
    const equipment = await EnergyEquipment.findByPk(req.params.id,{
      attributes: ['id_equipment','name', 'capacity', 'housing'],
    });
    // Check if the equipment exists
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    // Get the start and end dates from the query parameters
    let start = req.query.start ? new Date(req.query.start) : new Date(0);
    let end = req.query.end ? new Date(req.query.end) : new Date();

    // Check if the start and end dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date." });
    }

    // Check if the start date is before the end date
    if (start > end) {
      return res.status(400).json({ message: "Start date must be before end date." });
    }

    // Get the energy productions for the equipment within the specified date range
    const givenEnergy = await equipment.getGivenEnergies({
      where:{
        date: {
          [Op.and]: [
            { [Op.gte]: start },
            { [Op.lte]: end }
          ]
        }
      },
      attributes: ['id', 'value','date'],
    });

    // Add the energy productions to the equipment object
    equipment.dataValues.givenEnergy = givenEnergy;

    res.status(200).json({ data: equipment });
  } catch (error) {
    next(error);
  }
}
// Get energy productions by equipment
async function getEnergyProductionsOfEquipment(req, res, next) {
  try {
    // Get the equipment by ID
    const equipment = await EnergyEquipment.findByPk(req.params.id,{
      attributes: ['id_equipment','name', 'capacity', 'housing'],
    });
    // Check if the equipment exists
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    // Get the start and end dates from the query parameters
    let start = req.query.start ? new Date(req.query.start) : new Date(0);
    let end = req.query.end ? new Date(req.query.end) : new Date();

    // Check if the start and end dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date." });
    }

    // Check if the start date is before the end date
    if (start > end) {
      return res.status(400).json({ message: "Start date must be before end date." });
    }

    // Get the energy productions for the equipment within the specified date range
    const givenEnergy = await equipment.getEnergyProductions({
      where:{
        date: {
          [Op.and]: [
            { [Op.gte]: start },
            { [Op.lte]: end }
          ]
        }
      },
      attributes: ['id', 'value','date'],
    });

    // Add the energy productions to the equipment object
    equipment.dataValues.givenEnergy = givenEnergy;

    res.status(200).json({ data: equipment });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllEnergyEquipments,
  createEnergyEquipment,
  updateEnergyEquipmentName,
  deleteEnergyEquipment,
  getGivenEnergyOfEquipment,
  getEnergyProductionsOfEquipment
};
