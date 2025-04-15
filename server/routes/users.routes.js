// route for /Users requests

const express = require('express');
const router = express.Router();

// include controller functions
const usersController= require('../controllers/users.controller.js');

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);

router.post('/', usersController.validateUsersBodyData, usersController.addUser);
router.put('/:id', usersController.validateUsersBodyData, usersController.updateUser);

module.exports = router;
