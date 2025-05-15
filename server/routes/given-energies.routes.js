const express = require('express');
const router = express.Router();
const validateIdParam = require('../middleware/validateIdParam.js');

const givenEnergiesController = require('../controllers/given-energies.controller.js');
//const { verifyToken } = require('../middleware/auth.middleware.js');

router.get('/', givenEnergiesController.getgivenEnergies);

router.post('/', givenEnergiesController.addgivenEnergies);

router.delete('/:id', validateIdParam("id"),givenEnergiesController.deleteGivenEnergy);

module.exports = router;