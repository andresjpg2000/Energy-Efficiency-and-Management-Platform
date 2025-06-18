const express = require("express");
const router = express.Router();
const housingsController = require("../controllers/housings.controller.js");

const auth = require("../middleware/auth.js");
const validateIdParam = require("../middleware/validateIdParam.js");
const verifyOwnership = require("../middleware/verifyOwnership.js");

// Get all housings. If the user is an admin, return all housings, otherwise return only the user's housings.
router.get("/", auth, housingsController.getAllHousings);

// Get all equipments from a housing
router.get(
  "/:id_housing/equipments",
  auth,
  validateIdParam("id_housing"),
  verifyOwnership,
  housingsController.getAllEquipsFromHouse,
);

// Get all energy consumptions from a housing
router.get(
  "/:id_housing/energy-consumptions",
  auth,
  validateIdParam("id_housing"),
  verifyOwnership,
  housingsController.getAllEnergyConsumptionsFromHouse,
);

// Create a new housing
router.post("/", auth, housingsController.createHousing);

// Partially update a housing by ID
router.patch(
  "/:id_housing",
  auth,
  validateIdParam("id_housing"),
  housingsController.partialUpdateHousing,
);

// Delete a housing by ID
router.delete(
  "/:id_housing",
  auth,
  validateIdParam("id_housing"),
  housingsController.deleteHousing,
);

// Get location of a housing by ID
router.get(
  "/:id_housing/location",
  auth,
  validateIdParam("id_housing"),
  housingsController.getLocationByHousingId,
);

module.exports = router;
