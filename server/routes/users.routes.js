const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller.js");
const authenticate = require("../middleware/auth.js");
const authorizeAdmin = require("../middleware/authorizeAdmin.js");

// Listar todos os utilizadores (só admin)
router.get("/", authenticate, authorizeAdmin, usersController.getAllUsers);

// Atualizar parcialmente dados de um utilizador
router.patch("/:id_user", authenticate, usersController.updateUser);

// Atualizar password de um utilizador (Apenas o próprio ou admin) - recebe currentPassword e newPassword
router.patch(
  "/:id_user/changePassword",
  authenticate,
  usersController.updateUserPassword,
);

// Atualizar 2FA de um utilizador (Apenas o próprio ou admin)
router.patch("/:id_user/toggle-2fa", authenticate, usersController.toggle2FA);

// Eliminar um utilizador (Apenas admins)
router.delete(
  "/:id_user",
  authenticate,
  authorizeAdmin,
  usersController.deleteUser,
);

// Obter widgets de um utilizador (Apenas o próprio)
router.get(
  "/:id_user/widgets",
  authenticate,
  usersController.getAllUserWidgets,
);

// Obter todas as housings de um utilizador (Apenas o próprio)
router.get(
  "/:id_user/housings",
  authenticate,
  usersController.getAllUserHouses,
);

// Obter todas as housings de um utilizador com informações adicionais, só admin
router.get(
  "/:id_user/housings/info",
  authenticate,
  authorizeAdmin,
  usersController.getAllUserHousesInfo,
);

module.exports = router;
