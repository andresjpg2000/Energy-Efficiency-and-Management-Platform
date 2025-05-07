

const express = require('express');
const router = express.Router();

const givenEnergiesController = require('../controllers/given-energies.controller.js');
//const { verifyToken } = require('../middleware/auth.middleware.js');

router.get('/', givenEnergiesController.getgivenEnergies);

router.post('/', givenEnergiesController.addgivenEnergies);

module.exports = router;