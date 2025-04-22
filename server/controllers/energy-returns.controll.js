// Import the users data model
const energyReturn = require("../models/energy-return.model.js");

// get all energy returns
let getEnergyReturns = (req, res) => {
  if (!req.query.houseId) {
    return res.status(400).json({
      message: "House ID is required",
    });
  }
  let houseId = parseInt(req.query.houseId);
  let filterEnergy = [];
  
  if (isNaN(houseId)) {
    return res.status(400).json({
      message: "House ID must be a number",
    });
  }
  if (houseId < 0) {
    return res.status(400).json({
      message: "House ID must be a positive number",
    });
  }
  
  let userId = parseInt(req.query.userId); // TOKEN VERIFICAR AQUI

  let start = req.query.start ? new Date(req.query.start) : new Date(0);
  let end = req.query.end ? new Date(req.query.end) : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      message: "Invalid date format",
    });
  }
  if (start > end) {
    return res.status(400).json({
      message: "The param end must be after than the param start!",
    });
  }

  if (req.query.equipamentId) {
    let equipamentId = req.query.equipamentId;

    if (isNaN(equipamentId)) {
      return res.status(400).json({
        message: "Equipament ID must be a number",
      });
    }
    if (equipamentId < 0) {
      return res.status(400).json({
        message: "Equipament ID must be a positive number",
      });
    }

    filterEnergy = energyReturn.filter(energy => {
      energy.houseId == houseId &&
      energy.equipamentId == equipamentId && 
      energy.date >= start && energy.date <= end;
    });
  }else {
    filterEnergy = energyReturn.filter(energy => {
      energy.houseId == houseId && 
      energy.date >= start && energy.date <= end;
    });
  }

  if (filterEnergy.length == 0) {
    return res.status(404).json({
      message: "No energy returns found",
    });
  } 

  if (!req.query.limit) {

    return res.status(200).json({
      message: "Energy returns found",
      data: filterEnergy,
    });
    
  } else {
    
    let limit = parseInt(req.query.limit);
    if (isNaN(limit)) {
      return res.status(400).json({
        message: "Limit must be a number",
      });
    }
    if (limit < 3) {
      return res.status(400).json({
        message: "Limit must be a more than 3 items",
      });
    }
    return res.status(200).json({
      message: "Energy returns found",
      data: filterEnergy.slice(0, limit),
    });
  } 
}


module.exports = {
  getEnergyReturns,
};
