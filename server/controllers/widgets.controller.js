// Import the suppliers model
const db = require('../models/index.js');
const Widgets = db.widgets; 

// let getWidgets = async (req, res) => {
//     try {
//         const userId = req.query.user; // token verificar aqui
//         if (!userId) {
//             return res.status(400).json({
//                 message: `Missing required fields USER: ${userId}`,
//             });
//         }
//         // Find all widgets for the user
//         const widgets = await Widgets.findAll({
//             where: {
//                 id_user: userId
//             }
//         });
//         if (widgets.length === 0) {
//             return res.status(404).json({
//                 message: "No widgets found!",
//             });
//         }
//         return res.status(200).json({
//             message: "Energy widgets found",
//             data: widgets
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Error retrieving widgets",
//             error: error.message
//         });
//     }
// }

let addWidgets = async (req, res) => {
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
        type
    };
    try {

        const createdWiget = await Widgets.create(newWiget);

        return res.status(201).json({
            message: "Widget created successfully",
            data: createdWiget
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Error creating widget",
            error: error.message
        });
        
    }
}

let updateWidgets = async (req, res) => {
    const { title } = req.params;
    const { id_user } = req.query; 
    const { body, type } = req.body;

    if (req.body.title) {
        return res.status(400).json({
            message: "Title cannot be updated",
        });
    }

    if (req.body.id_user) {
        return res.status(400).json({
            message: "id_user cannot be updated",
        });
    }

    if (!id_user || !title || !body ) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    try {
        const widget = await Widgets.findOne({
            where: {
                id_user,
                title
            }
        });

        if (!widget) {
            return res.status(404).json({
                message: "Widget not found"
            });
        }

        widget.body = body;
        widget.type = type || widget.type;

        await widget.save();

        return res.status(200).json({
            message: "Widget updated successfully",
            data: widget
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating widget",
            error: error.message
        });
    }
}

let deleteWidgets = async (req, res) => {
    const { id_user } = req.query;// token verificar aqui
    const { title } = req.params;

    if (!id_user || !title) {
        return res.status(400).json({
            message: "Missing required parameters (id_user and title)"
        });
    }    

    try {
        const widget = await Widgets.findOne({
            where: {
                id_user,
                title
            }
        });

        if (!widget) {
            return res.status(404).json({
                message: "Widget not found"
            });
        }

        await widget.destroy();
        return res.status(204).send(); // No content response
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting widget",
            error: error.message
        });
    }
}

module.exports = {
    //getWidgets,
    addWidgets,
    deleteWidgets,
    updateWidgets
  };
  