const wigets = require("../models/wigets.model.js");

let getWigets = (req, res) => {

    userId = parseInt(req.query.userId); // TOKEN VERIFICAR AQUI

    let userWigets = wigets.filter(wiget => wiget.userId === userId);

    userWigets.forEach(wiget => {
        delete wiget.userId;
    });

  return res.status(200).json({
    message: "Energy widgets found",
    data: userWigets
  });
}

let addWigets = (req, res) => {
    const { userId, name, type, data } = req.body; // token verificar aqui

    if (!userId || !name || !type || !data) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    const newWiget = {
        userId,
        name,
        type,
        data
    };

    wigets.push(newWiget);

    return res.status(201).json({
        message: "Wiget created successfully",
        data: newWiget
    });
}

let deleteWigets = (req, res) => {
    const { title } = req.params;
    if (!title) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }
    const { userId } = req.body; // token verificar aqui

    const index = wigets.findIndex(wiget => wiget.title === parseInt(title) && wiget.userId === userId);

    if (index === -1) {
        return res.status(404).json({
            message: "Wiget not found",
        });
    }

    wigets.splice(index, 1);

    return res.status(200).json({
        message: "Wiget deleted successfully",
    });
}

module.exports = {
    getWigets,
    addWigets,
    deleteWigets
  };
  