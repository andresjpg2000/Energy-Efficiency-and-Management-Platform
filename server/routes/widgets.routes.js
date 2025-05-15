const express = require('express');
const router = express.Router();

const widgetsController = require('../controllers/widgets.controller.js');
const authenticate = require('../middleware/auth.js');

//const { verifyToken } = require('../middleware/auth.middleware.js');

//router.get('/', widgetsController.getWidgets);

router.post('/',authenticate() ,widgetsController.addWidgets);

router.delete('/:title',authenticate() , widgetsController.deleteWidgets);

module.exports = router;