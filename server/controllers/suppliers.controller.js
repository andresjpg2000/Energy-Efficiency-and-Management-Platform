// Import the suppliers model
const { Supplier } = require("../models/index.js");

// Get all suppliers
const getAllSuppliers = async (req, res, next) => {
  try {
    // options object to hold query parameters so we dont have to list every attribute to get the entire supplier object
    const options = {};
    // Get attributes from the query string
    const attributeArray = req.query.attributes
      ? req.query.attributes.split(",").map((a) => a.trim())
      : undefined;
    if (attributeArray && attributeArray.length > 0) {
      // Only add attributes if they are provided
      options.attributes = attributeArray;
    }
    // Fetch all suppliers from the database
    const suppliers = await Supplier.findAll(options);
    // Check if suppliers were found
    if (suppliers.length === 0) {
      return res.status(404).json({
        message: "No suppliers found!",
      });
    }
    // Send a response with the suppliers data
    res.status(200).json({
      data: suppliers,
      links: [
        {
          rel: "self",
          href: `/suppliers`,
          method: "GET",
        },
        {
          rel: "get-by-id",
          href: `/suppliers/:id`,
          method: "GET",
        },
        {
          rel: "create",
          href: `/suppliers`,
          method: "POST",
        },
        {
          rel: "update",
          href: `/suppliers/:id`,
          method: "PUT",
        },
        {
          rel: "partial-update",
          href: `/suppliers/:id`,
          method: "PATCH",
        },
        {
          rel: "delete",
          href: `/suppliers/:id`,
          method: "DELETE",
        },
      ],
    });
  } catch (err) {
    next(err);
  }
};

// Post a new supplier
const createSupplier = async (req, res, next) => {
  // Create a new supplier object
  const newSupplier = {
    enterprise: req.body.enterprise,
    cost_kWh: req.body.cost_kWh,
  };

  try {
    // Add the new supplier to the database
    const createdSupplier = await Supplier.create(newSupplier);
    // Send a response with the created supplier
    res.status(201).json({
      data: createdSupplier,
      message: "Supplier created successfully!",
      links: [
        {
          rel: "self",
          href: `/suppliers`,
          method: "POST",
        },
        {
          rel: "get-by-id",
          href: `/suppliers/${createdSupplier.id}`,
          method: "GET",
        },
        {
          rel: "get-all",
          href: `/suppliers`,
          method: "GET",
        },
        {
          rel: "update",
          href: `/suppliers/${createdSupplier.id}`,
          method: "PUT",
        },
        {
          rel: "partial-update",
          href: `/suppliers/${createdSupplier.id}`,
          method: "PATCH",
        },
        {
          rel: "delete",
          href: `/suppliers/${createdSupplier.id}`,
          method: "DELETE",
        },
      ],
    });
  } catch (err) {
    // Handle other errors
    next(err);
  }
};

// Partially update a supplier
const partialUpdateSupplier = async (req, res, next) => {
  // Find the supplier by ID
  const supplier = await Supplier.findByPk(req.params.id);
  if (!supplier) {
    return res.status(404).json({
      message: `Supplier with ID ${req.params.id} not found!`,
    });
  }

  // Update the supplier's properties based on the request body
  if (req.body.enterprise) {
    supplier.enterprise = req.body.enterprise;
  }
  if (req.body.cost_kWh) {
    supplier.cost_kWh = req.body.cost_kWh;
  }

  try {
    // Save the updated supplier to the database
    await supplier.save();
    // Send a response with the updated supplier
    res.status(200).json({
      data: supplier,
      message: `Supplier with ID ${supplier.id} partially updated successfully!`,
      links: [
        {
          rel: "self",
          href: `/suppliers/${supplier.id}`,
          method: "PATCH",
        },
        {
          rel: "get-by-id",
          href: `/suppliers/${supplier.id}`,
          method: "GET",
        },
        {
          rel: "get-all",
          href: `/suppliers`,
          method: "GET",
        },
        {
          rel: "create",
          href: `/suppliers`,
          method: "POST",
        },
        {
          rel: "update",
          href: `/suppliers/${supplier.id}`,
          method: "PUT",
        },
        {
          rel: "delete",
          href: `/suppliers/${supplier.id}`,
          method: "DELETE",
        },
      ],
    });
  } catch (err) {
    next(err);
  }
};

// Delete a supplier
const deleteSupplier = async (req, res, next) => {
  // Find the supplier by ID
  const supplier = await Supplier.findByPk(req.params.id);

  if (!supplier) {
    return res.status(404).json({
      message: `Supplier with ID ${req.params.id} not found!`,
    });
  }

  try {
    // Delete the supplier from the database
    await supplier.destroy();
    // Send a response indicating successful deletion
    res.status(204).json({
      message: `Supplier with ID ${req.params.id} deleted successfully!`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSuppliers,
  createSupplier,
  deleteSupplier,
  partialUpdateSupplier,
};
