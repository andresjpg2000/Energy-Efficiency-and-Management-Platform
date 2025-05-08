const db = require("../models/index.js");
const EnergyEquipment = db.EnergyEquipment;

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

    if (!name || name.length < 3) {
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

module.exports = {
  getAllEnergyEquipments,
  createEnergyEquipment,
  updateEnergyEquipmentName,
  deleteEnergyEquipment,
};
