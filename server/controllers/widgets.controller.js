// Import the suppliers model
const db = require("../models/index.js");
const Widgets = db.widgets;

let addWidgets = async (req, res, next) => {
  const { id_user, title, body, type } = req.body; // token verificar aqui

  if (!id_user || !title || !body || !type) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  const newWiget = {
    id_user,
    title,
    body,
    type,
  };
  try {
    const createdWiget = await Widgets.create(newWiget);

    return res.status(201).json({
      message: "Widget created successfully",
      data: createdWiget,
    });
  } catch (error) {
    next(error);
  }
};

let updateWidgets = async (req, res, next) => {
  const { title } = req.params;
  const { id_user } = req.query;
  const { x, y, ...extraFields } = req.body;

  if (!id_user || !title || x === undefined || y === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({ message: "Only x and y fields are allowed" });
  }
  try {
    const widget = await Widgets.findOne({ where: { id_user, title } });
    if (!widget) return res.status(404).json({ message: "Widget not found" });

    let parsed;
    try {
      parsed = JSON.parse(widget.body);
    } catch {
      parsed = {}; // se não for JSON válido
    }
    parsed.x = x;
    parsed.y = y;

    widget.body = parsed;
    await widget.save();

    return res.status(200).json({ message: "Widget updated", data: widget });
  } catch (error) {
    next(error);
  }
};

let deleteWidgets = async (req, res, next) => {
  const { id_user } = req.query; // token verificar aqui
  const { title } = req.params;

  if (!id_user || !title) {
    return res.status(400).json({
      message: "Missing required parameters (id_user and title)",
    });
  }

  try {
    const widget = await Widgets.findOne({
      where: {
        id_user,
        title,
      },
    });

    if (!widget) {
      return res.status(404).json({
        message: "Widget not found",
      });
    }

    await widget.destroy();
    return res.status(204).send(); // No content response
  } catch (error) {
    next(error);
  }
};

module.exports = {
  //getWidgets,
  addWidgets,
  deleteWidgets,
  updateWidgets,
};
