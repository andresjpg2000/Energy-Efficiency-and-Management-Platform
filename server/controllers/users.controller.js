const db = require("../models/index.js");
const User = db.User;
const bcrypt = require("bcryptjs"); // Para encriptar passwords

// Obter todos os utilizadores
async function getAllUsers(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: { exclude: ["password"] }, // Excluir a password da resposta
    });
    res.status(200).json({
      users: rows,
      total: count,
      page,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
}

// Get all equipments from a housing
let getAllUserWidgets = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id_user, {
      attributes: ["id_user"],
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // lazy loading
    const widgets = await user.getWidgets({
      attributes: ["title", "body", "type"],
    });

    user.dataValues.widgets = widgets;
    res.status(200).json({
      data: user,
    });
  } catch (err) {
    console.error("Error fetching Users Widgets:", err);

    next(err);
  }
};

// Obter todas as notificações do utilizador
let getAllUserHouses = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id_user, {
      attributes: ["id_user"],
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // lazy loading
    const houses = await user.getHousings({
      attributes: [
        "id_housing",
        "address",
        "pc",
        "building_type",
        "id_supplier",
      ],
    });

    houses.forEach((h) => {
      h.dataValues.links = [
        { rel: "delete", href: `/housing/${h.id_housing}`, method: "DELETE" },
        { rel: "update", href: `/housing/${h.id_housing}`, method: "PUT" },
        {
          rel: "parcialUpdate",
          href: `/housing/${h.id_housing}`,
          method: "PATCH",
        },
      ];
    });

    user.dataValues.houses = houses;
    res.status(200).json({
      data: user,
    });
  } catch (err) {
    console.error("Error fetching Users Houses:", err);

    next(err);
  }
};

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

// Atualizar dados de um utilizador
async function updateUser(req, res, next) {
  try {
    const id_user = req.params.id_user;
    // Verificar se o utilizador é o próprio ou admin
    if (id_user != req.user.id_user) {
      // Se não for o próprio utilizador, verificar se é admin
      const user = await User.findByPk(req.user.id_user, {
        attributes: ['id_user', 'admin']
      });
      if (!user || !user.admin) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    const { email, name, password, admin} = req.body;
    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = { email, name };
    if (req.body.notification_settings) {
      updateData.notification_settings = req.body.notification_settings;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10); // Encriptar a password
    }

    if (admin !== undefined) {
      updateData.admin = admin;
    }

    await user.update(updateData);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Atualizar password de um utilizador
async function updateUserPassword(req, res, next) {
  try {
    const id_user = req.params.id_user;
    // Verificar se o utilizador é o próprio ou admin
    if (id_user != req.user.id_user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { currentPassword, newPassword } = req.body;
    // Verificar se a password atual está correta
    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(403).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); // Encriptar a password
    user.password = hashedPassword;

    await user.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Atualizar 2FA de um utilizador
async function toggle2FA(req, res, next) {
  try {
    const id_user = req.params.id_user;
    // Verificar se o utilizador é o próprio ou admin
    if (id_user != req.user.id_user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Toggle the 2FA status
    user.two_factor_enabled = !user.two_factor_enabled; // Toggle the 2FA status
    await user.save();
    // res.status(204).send();
    res.status(200).json({ two_factor_enabled: user.two_factor_enabled });
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
  updateUser,
  deleteUser,
  toggle2FA,
  getAllUserWidgets,
  updateUserPassword,
  getAllUserHouses,
};
