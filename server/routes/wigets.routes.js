const express = require('express');
const router = express.Router();

const widgetsController = require('../controllers/widgets.controller.js');
//const { verifyToken } = require('../middleware/auth.middleware.js');

router.get('/', widgetsController.getWidgets);

router.post('/', widgetsController.addWidgets);

router.delete('/:title', widgetsController.deleteWidgets);

module.exports = router;