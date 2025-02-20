const DatabaseService = require("./databaseService");
const db = require("../models");

class TemperamentService {
  static async populateTemperaments() {
    try {
      const data = await DatabaseService.readJsonFile("temperaments.json");
      await DatabaseService.executeQuery(data.query);
      console.log("Temperaments data populated successfully");
    } catch (error) {
      console.error("Error populating temperaments:", error);
      throw error;
    }
  }
}

module.exports = TemperamentService;
