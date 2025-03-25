const express = require("express");
const { getNearbyNGOs } = require("../controllers/ngoController");
const router = express.Router();

// Validation middleware for location query
const validateLocation = (req, res, next) => {
  const { longitude, latitude } = req.query;

  // Check if both longitude and latitude are provided
  if (!longitude || !latitude) {
    return res.status(400).json({
      error: "Both longitude and latitude must be provided",
    });
  }

  // Check if both longitude and latitude are valid numbers
  if (isNaN(longitude) || isNaN(latitude)) {
    return res
      .status(400)
      .json({ error: "Longitude and latitude must be valid numbers" });
  }

  // Proceed to the next middleware or controller if validation passes
  next();
};

// Route to get nearby NGOs with location validation
router.get("/nearby", validateLocation, getNearbyNGOs);

module.exports = router;
