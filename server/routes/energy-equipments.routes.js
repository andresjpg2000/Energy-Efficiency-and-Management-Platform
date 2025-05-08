const express = require('express');
const router = express.Router();
const energyEquipmentsController = require('../controllers/energy-equipments.controller.js');

// Listar todos os equipamentos
router.get('/', energyEquipmentsController.getAllEnergyEquipments);

// Criar um novo equipamento
router.post('/', energyEquipmentsController.createEnergyEquipment);

// Atualizar nome de um equipamento
router.patch('/:id', energyEquipmentsController.updateEnergyEquipmentName);

// Eliminar um equipamento
router.delete('/:id', energyEquipmentsController.deleteEnergyEquipment);

module.exports = router;
