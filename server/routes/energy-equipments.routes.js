const express = require('express');
const router = express.Router();
const energyEquipmentsController = require('../controllers/energy-equipments.controller.js');

const auth = require('../middleware/auth.js');
const validateParamIsInt = require('../middleware/validateIdParam.js'); 

// Listar todos os equipamentos
router.get('/', auth(true), energyEquipmentsController.getAllEnergyEquipments);

// Criar um novo equipamento
router.post('/', auth(), energyEquipmentsController.createEnergyEquipment);

// Atualizar nome de um equipamento
router.patch('/:id', auth(), energyEquipmentsController.updateEnergyEquipmentName);

// Eliminar um equipamento
router.delete('/:id',auth(), energyEquipmentsController.deleteEnergyEquipment);

// get given energy of an equipment
router.get('/:id/given-energies',validateParamIsInt("id"), energyEquipmentsController.getGivenEnergyOfEquipment);

// get energy productions of an equipment
router.get('/:id/energy-productions', validateParamIsInt("id"), energyEquipmentsController.getEnergyProductionsOfEquipment);
module.exports = router;
