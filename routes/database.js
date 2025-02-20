const express = require("express");
const router = express.Router();
const PopulationService = require("../services/populationService");

// Populate database
router.post("/populate-database", async (req, res) => {
  try {
    await PopulationService.populateDatabase();
    res.json({
      success: true,
      message: "Database populated successfully",
    });
  } catch (error) {
    console.error("Population error:", error);
    res.status(500).json({
      success: false,
      message: `Error populating database: ${error.message}`,
    });
  }
});

module.exports = router;
