const express = require('express');
const router = express.Router();
const validateIdParam = require('../middleware/validateIdParam.js');
const auth = require('../middleware/auth.js');
const givenEnergiesController = require('../controllers/given-energies.controller.js');
//const { verifyToken } = require('../middleware/auth.middleware.js');

router.get('/', auth, givenEnergiesController.getgivenEnergies);

router.post('/', auth, givenEnergiesController.addgivenEnergies);

router.delete('/:id', auth, validateIdParam("id"),givenEnergiesController.deleteGivenEnergy);

module.exports = router;