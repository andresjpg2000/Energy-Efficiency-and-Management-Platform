const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller.js");
const authenticate = require("../middleware/auth.js");
const authorizeAdmin = require("../middleware/authorizeAdmin.js");

// Listar todos os utilizadores (só admin)
router.get("/", authenticate(), authorizeAdmin, usersController.getAllUsers);

// Obter um utilizador por ID (Apenas o próprio ou admin)
router.get("/:id_user", authenticate(), usersController.getUserById);

// Criar um novo utilizador (Sem autenticação)
router.post("/", usersController.createUser);

// Atualizar dados de um utilizador (Apenas o próprio ou admin)
router.put("/:id_user", authenticate(), usersController.updateUser);

// Eliminar um utilizador (Apenas admins)
router.delete("/:id_user", authenticate(true), usersController.deleteUser);

// Obter widgets de um utilizador (Apenas o próprio)
router.get(
  "/:id_user/widgets",
  authenticate(),
  usersController.getAllUserWidgets
);

module.exports = router;
