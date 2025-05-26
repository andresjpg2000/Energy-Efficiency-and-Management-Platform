const express = require('express');
const router = express.Router();

const widgetsController = require('../controllers/widgets.controller.js');
const authenticate = require('../middleware/auth.js');

//router.get('/', widgetsController.getWidgets);

router.post('/',authenticate, widgetsController.addWidgets);

router.delete('/:title',authenticate, widgetsController.deleteWidgets);

router.patch('/:title', widgetsController.updateWidgets);

module.exports = router;