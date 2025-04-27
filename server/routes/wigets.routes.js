const express = require('express');
const router = express.Router();

const wigetsController = require('../controllers/wigets.controller.js');
//const { verifyToken } = require('../middleware/auth.middleware.js');

router.get('/', wigetsController.getWigets);

router.post('/', wigetsController.addWigets);

router.delete('/:id', wigetsController.deleteWigets);

module.exports = router;