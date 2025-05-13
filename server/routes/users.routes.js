const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller.js');
const authenticate = require('../middleware/auth.js');

// Listar todos os utilizadores (Apenas admins)
router.get('/', authenticate(true), usersController.getAllUsers);

// Obter um utilizador por ID (Apenas o próprio ou admin)
router.get('/:id_user', authenticate, usersController.getUserById);

// Criar um novo utilizador (Sem autenticação)
router.post('/', usersController.createUser);

// Atualizar dados de um utilizador (Apenas o próprio ou admin)
router.put('/:id_user', authenticate, usersController.updateUser);

// Eliminar um utilizador (Apenas admins)
router.delete('/:id_user', authenticate(true), usersController.deleteUser);

module.exports = router;
