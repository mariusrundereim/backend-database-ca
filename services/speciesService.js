const DatabaseService = require("./databaseService");
const db = require("../models");

class SpeciesService {
  static async populateSpecies() {
    try {
      const data = await DatabaseService.readJsonFile("species.json");
      await DatabaseService.executeQuery(data.query);
      console.log("Species data populated successfully");
    } catch (error) {
      console.error("Error populating species:", error);
      throw error;
    }
  }
}

module.exports = SpeciesService;
