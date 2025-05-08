const db = require("../models/index.js");
const User = db.User;
const bcrypt = require("bcryptjs"); // Para encriptar passwords

// Obter todos os utilizadores
async function getAllUsers(req, res, next) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

// Obter um utilizador por ID
async function getUserById(req, res, next) {
  try {
    const { id_user } = req.params;
    const user = await User.findByPk(id_user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

// Criar um novo utilizador
async function createUser(req, res, next) {
  try {
    const { email, name, password, admin } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar a password

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      admin: admin || 0,
    });
    res
      .status(201)
      .json({ message: "User created successfully", id_user: newUser.id_user });
  } catch (error) {
    next(error);
  }
}

// Atualizar dados de um utilizador
async function updateUser(req, res, next) {
  try {
    const { id_user } = req.params;
    const { email, name, password, admin } = req.body;

    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar a password

    await user.update({ email, name, password: hashedPassword, admin });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Eliminar um utilizador
async function deleteUser(req, res, next) {
  try {
    const { id_user } = req.params;
    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
