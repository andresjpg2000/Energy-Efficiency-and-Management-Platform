// users.routes.js

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller.js');

// Listar todos os utilizadores
router.get('/', usersController.getAllUsers);

// Obter um utilizador por ID
router.get('/:id_user', usersController.getUserById);

// Criar um novo utilizador
router.post('/', usersController.createUser);

// Atualizar dados de um utilizador
router.put('/:id_user', usersController.updateUser);

// Eliminar um utilizador
router.delete('/:id_user', usersController.deleteUser);

module.exports = router;
