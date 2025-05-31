const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller.js");
const authenticate = require("../middleware/auth.js");
const authorizeAdmin = require("../middleware/authorizeAdmin.js");

// Listar todos os utilizadores (só admin)
router.get("/", authenticate, authorizeAdmin, usersController.getAllUsers);

// Obter um utilizador por ID (Apenas o próprio ou admin)
router.get("/:id_user", authenticate, usersController.getUserById);

// Atualizar dados de um utilizador (Apenas o próprio ou admin)
// router.put("/:id_user", authenticate, usersController.updateUser);

// Atualizar parcialmente dados de um utilizador
router.patch("/:id_user", authenticate, usersController.updateUser);

// Atualizar password de um utilizador (Apenas o próprio ou admin) - recebe currentPassword e newPassword
router.patch("/:id_user/changePassword", authenticate, usersController.updateUserPassword);

// Eliminar um utilizador (Apenas admins)
router.delete("/:id_user", authenticate, authorizeAdmin, usersController.deleteUser);

// Obter widgets de um utilizador (Apenas o próprio)
router.get(
  "/:id_user/widgets",
  authenticate,
  usersController.getAllUserWidgets
);

// Obter Notifications de um Utilizador (Apenas o próprio)
router.get(
  "/:id_user/notifications",
  authenticate,
  usersController.getAllUserNotifications
);

// Obter todas as housings de um utilizador (Apenas o próprio)
router.get(
  "/:id_user/housings",
  authenticate,
  usersController.getAllUserHouses
);

module.exports = router;
