const { Housing, PostalCode } = require("../models/index.js");
const { ValidationError, UniqueConstraintError } = require("sequelize");
const { Op } = require("sequelize");

async function checkIfUserIsTheOwner(user, id_housing) {
  const housing = await Housing.findOne({
    where: {
      id_housing: id_housing,
    },
  });

  if (!housing) {
    throw { status: 404, message: "Housing not found!" };
  }

  if (housing.id_user !== user.id_user && !user.admin) {
    throw {
      status: 403,
      message: "You are not authorized to access this housing!",
    };
  }

  return housing;
}

async function createOrUpdatePostalCode(pc, location) {
  // Check if the postal code already exists
  const [postalCode, created] = await PostalCode.findOrCreate({
    where: { pc },
    defaults: { location },
  });
  // If postal code already exists, update the location if provided
  if (!created && location && postalCode.location !== location) {
    await postalCode.update({ location });
  }

  return postalCode;
}

// Get all housings
const getAllHousings = async (req, res, next) => {
  try {
    let housings = [];

    housings = await Housing.findAll({
      where: {
        id_user: req.user.id_user,
      },
      attributes: [
        "id_housing",
        "address",
        "pc",
        "building_type",
        "id_user",
        "id_supplier",
      ],
      order: [["id_housing", "ASC"]],
    });

    if (!housings || housings.length === 0) {
      return res.status(404).json({ message: "No housings found!" });
    }

    res.status(200).json({
      data: housings,
      links: [
        {
          rel: "self",
          href: `/housings`,
          method: "GET",
        },
        {
          rel: "get-by-id",
          href: `/housings/:id_housing`,
          method: "GET",
        },
        {
          rel: "create",
          href: `/housings`,
          method: "POST",
        },
        {
          rel: "update",
          href: `/housings/:id_housing`,
          method: "PUT",
        },
        {
          rel: "partial-update",
          href: `/housings/:id_housing`,
          method: "PATCH",
        },
        {
          rel: "delete",
          href: `/housings/:id_housing`,
          method: "DELETE",
        },
      ],
    });
  } catch (err) {
    console.error("Error fetching housings:", err);

    next(err);
  }
};
// Get all equipments from a housing
let getAllEquipsFromHouse = async (req, res, next) => {
  try {
    const house = await Housing.findByPk(req.params.id_housing, {
      attributes: ["id_housing", "id_user", "address", "pc", "building_type"],
    });
    if (!house) {
      return res.status(404).json({
        message: "House not found",
      });
    }

    // lazy loading
    const equipments = await house.getEnergyEquipments({
      attributes: [
        "id_equipment",
        "name",
        "energy_type",
        "capacity",
        "housing",
      ],
    });

    //map HATEOAS links to each equipment
    equipments.forEach((eq) => {
      eq.dataValues.links = [
        {
          rel: "delete",
          href: `/energy-equipments/${eq.id_equipment}`,
          method: "DELETE",
        },
        {
          rel: "modify",
          href: `/energy-equipments/${eq.id_equipment}`,
          method: "PUT",
        },
      ];
    });

    house.dataValues.equipments = equipments;
    res.status(200).json({
      data: house,
    });
  } catch (err) {
    console.error("Error fetching equipments:", err);

    next(err);
  }
};

// Get all equipments from a housing
let getAllEnergyConsumptionsFromHouse = async (req, res, next) => {
  try {
    const house = await Housing.findByPk(req.params.id_housing, {
      attributes: ["id_housing"],
    });
    if (!house) {
      return res.status(404).json({
        message: "House not found",
      });
    }

    // Get the start and end dates from the query parameters
    let start = req.query.start ? new Date(req.query.start) : new Date(0);
    let end = req.query.end ? new Date(req.query.end) : new Date();

    // Check if the start and end dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date." });
    }

    // Check if the start date is before the end date
    if (start > end) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date." });
    }

    const size = req.query.size ? parseInt(req.query.size) : null;
    const page = req.query.page ? parseInt(req.query.page) : null;

    let pagination = {};
    if (size && page && size > 0 && page > 0) {
      pagination.limit = size;
      pagination.offset = (page - 1) * size;
    }
    // lazy loading
    const consumptions = await house.getConsumptions({
      where: {
        date: {
          [Op.and]: [{ [Op.gte]: start }, { [Op.lte]: end }],
        },
      },
      attributes: ["id_consumption", "value", "date"],
      order: [["date", "ASC"]],
      ...pagination,
    });

    consumptions.forEach((eq) => {
      eq.dataValues.links = [
        {
          rel: "delete",
          href: `/energy-consumptions/${eq.id_consumption}`,
          method: "DELETE",
        },
      ];
    });
    const totalItems = await house.countConsumptions({
      where: {
        date: {
          [Op.and]: [{ [Op.gte]: start }, { [Op.lte]: end }],
        },
      },
    });
    house.dataValues.consumptions = consumptions;
    res.status(200).json({
      data: house,
      pagination: pagination.limit
        ? {
          page,
          size,
          total: totalItems
        }
        : null,
    });
  } catch (err) {
    console.error("Error fetching consumptions:", err);

    next(err);
  }
};

// Get a housing by ID
const getHousingById = async (req, res, next) => {
  try {
    const user = req.user;
    const id_housing = req.params.id_housing;

    const housing = await checkIfUserIsTheOwner(user, id_housing);

    res.status(200).json({
      data: housing,
      links: [
        {
          rel: "self",
          href: `/housings/${housing.id_housing}`,
          method: "GET",
        },
        {
          rel: "get-all",
          href: `/housings`,
          method: "GET",
        },
        {
          rel: "create",
          href: `/housings`,
          method: "POST",
        },
        {
          rel: "update",
          href: `/housings/${housing.id_housing}`,
          method: "PUT",
        },
        {
          rel: "partial-update",
          href: `/housings/${housing.id_housing}`,
          method: "PATCH",
        },
        {
          rel: "delete",
          href: `/housings/${housing.id_housing}`,
          method: "DELETE",
        },
      ],
    });
  } catch (err) {
    // Handle any errors that occur during the database query
    console.error("Error fetching housing:", err);

    next(err);
  }
};

// Create a new housing
const createHousing = async (req, res, next) => {
  if (
    !req.body ||
    !req.body.address ||
    !req.body.pc ||
    !req.body.building_type ||
    !req.body.location ||
    !req.body.id_supplier
  ) {
    return res.status(400).json({
      message: "Address, postal code, location and building type are required!",
    });
  }

  try {
    const userID = req.user.id_user;
    // Create or update the postal code if it exists
    await createOrUpdatePostalCode(req.body.pc, req.body.location);

    const newHousing = await Housing.create({
      address: req.body.address,
      pc: req.body.pc,
      building_type: req.body.building_type,
      id_supplier: req.body.id_supplier,
      id_user: userID,
    });

    res.status(201).json({
      data: newHousing,
      links: [
        {
          rel: "self",
          href: `/housings`,
          method: "POST",
        },
        {
          rel: "get-by-id",
          href: `/housings/${newHousing.id_housing}`,
          method: "GET",
        },
        {
          rel: "get-all",
          href: `/housings`,
          method: "GET",
        },
        {
          rel: "update",
          href: `/housings/${newHousing.id_housing}`,
          method: "PUT",
        },
        {
          rel: "partial-update",
          href: `/housings/${newHousing.id_housing}`,
          method: "PATCH",
        },
        {
          rel: "delete",
          href: `/housings/${newHousing.id_housing}`,
          method: "DELETE",
        },
      ],
    });
  } catch (err) {
    // Handle any errors that occur during the database query
    console.error("Error creating housing:", err);

    // Handle specific db.Sequelize validation errors and join them into a single message
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.errors.map((err) => err.message).join(", "),
      });
    }
    // Handle unique constraint errors
    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Housing already exists!",
      });
    }
    // Handle other errors
    next(err);
  }
};

const updateHousing = async (req, res, next) => {
  if (
    !req.body ||
    !req.body.address ||
    !req.body.pc ||
    !req.body.building_type ||
    !req.body.id_supplier
  ) {
    return res.status(400).json({
      message:
        "Address, postal code, id_supplier and building type are required!",
    });
  }

  try {
    const user = req.user;
    const id_housing = req.params.id_housing;

    const housing = await checkIfUserIsTheOwner(user, id_housing);

    if (req.body.pc) {
      // Create or update the postal code if it exists
      await createOrUpdatePostalCode(req.body.pc, req.body.location);
    }

    // Only update if the user is the owner
    await Housing.update(req.body, {
      where: {
        id_housing: id_housing,
        id_user: user.id_user,
      },
    });

    res.status(200).json({
      message: `Housing with ID ${id_housing} updated successfully!`,
      links: [
        {
          rel: "self",
          href: `/housings/${id_housing}`,
          method: "PUT",
        },
        {
          rel: "get-by-id",
          href: `/housings/${id_housing}`,
          method: "GET",
        },
        {
          rel: "get-all",
          href: `/housings`,
          method: "GET",
        },
        {
          rel: "create",
          href: `/housings`,
          method: "POST",
        },
        {
          rel: "partial-update",
          href: `/housings/${id_housing}`,
          method: "PATCH",
        },
        {
          rel: "delete",
          href: `/housings/${id_housing}`,
          method: "DELETE",
        },
      ],
    });
  } catch (err) {
    console.error("Error updating housing:", err);

    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.errors.map((err) => err.message).join(", "),
      });
    }
    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Housing already exists!",
      });
    }
    next(err);
  }
};

// Partially update a housing by ID
const partialUpdateHousing = async (req, res, next) => {
  if (
    !req.body ||
    (!req.body.address &&
      !req.body.pc &&
      !req.body.building_type &&
      !req.body.id_supplier)
  ) {
    return res.status(400).json({
      message:
        "At least one of address, postal code, id_supplier or building type must be provided!",
    });
  }

  try {
    const user = req.user;
    const id_housing = req.params.id_housing;

    const housing = await checkIfUserIsTheOwner(user, id_housing);

    if (req.body.pc) {
      // Create or update the postal code if it exists
      await createOrUpdatePostalCode(req.body.pc, req.body.location);
    }

    // Only update if the user is the owner
    await Housing.update(req.body, {
      where: {
        id_housing: id_housing,
        id_user: user.id_user,
      },
    });

    res.status(200).json({
      message: `Housing with ID ${req.params.id_housing} updated successfully!`,
      links: [
        {
          rel: "self",
          href: `/housings/${id_housing}`,
          method: "PATCH",
        },
        {
          rel: "get-by-id",
          href: `/housings/${id_housing}`,
          method: "GET",
        },
        {
          rel: "get-all",
          href: `/housings`,
          method: "GET",
        },
        {
          rel: "create",
          href: `/housings`,
          method: "POST",
        },
        {
          rel: "update",
          href: `/housings/${id_housing}`,
          method: "PUT",
        },
        {
          rel: "delete",
          href: `/housings/${id_housing}`,
          method: "DELETE",
        },
      ],
    });
  } catch (err) {
    // Handle any errors that occur during the database query
    console.error("Error patching housing:", err);

    // Handle specific Sequelize validation errors and join them into a single message
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.errors.map((err) => err.message).join(", "),
      });
    }
    // Handle unique constraint errors
    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Housing already exists!",
      });
    }
    // Handle other errors
    next(err);
  }
};

// Delete a housing by ID
const deleteHousing = async (req, res, next) => {
  try {
    const user = req.user;
    const id_housing = req.params.id_housing;

    const housing = await checkIfUserIsTheOwner(user, id_housing);

    // Check if the housing exists
    if (!housing) {
      return res.status(404).json({ message: "Housing not found!" });
    }

    // Only update if the user is the owner
    await Housing.destroy({
      where: {
        id_housing: id_housing,
        id_user: user.id_user,
      },
    });

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting housing:", err);

    if (err.status && err.message) {
      return res.status(err.status).json({ message: err.message });
    }

    next(err);
  }
};

// Get location by postal code
const getLocationByHousingId = async (req, res, next) => {
  try {
    const user = req.user;
    const id_housing = req.params.id_housing;

    const housing = await checkIfUserIsTheOwner(user, id_housing);

    // Find the postal code associated with the housing
    const postalCode = await PostalCode.findOne({
      where: {
        pc: housing.pc,
      },
      attributes: ["location"],
    });

    if (!postalCode) {
      return res.status(404).json({ message: "Postal code not found!" });
    }

    res.status(200).json({
      data: { location: postalCode.location },
      links: [
        {
          rel: "self",
          href: `/housings/${id_housing}/location`,
          method: "GET",
        },
        {
          rel: "get-by-id",
          href: `/housings/${id_housing}`,
          method: "GET",
        },
        {
          rel: "get-all",
          href: `/housings`,
          method: "GET",
        },
      ],
    });
  } catch (err) {
    console.error("Error fetching location:", err);

    next(err);
  }
};

module.exports = {
  getAllHousings,
  getHousingById,
  createHousing,
  updateHousing,
  partialUpdateHousing,
  deleteHousing,
  getAllEquipsFromHouse,
  getAllEnergyConsumptionsFromHouse,
  getLocationByHousingId,
};
