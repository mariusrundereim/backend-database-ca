const DatabaseService = require("./databaseService");
const db = require("../models");

class AnimalService {
  static async populateAnimals() {
    try {
      const data = await DatabaseService.readJsonFile("animals.json");
      await DatabaseService.executeQuery(data.query);
      console.log("Animals data populated successfully");
    } catch (error) {
      console.error("Error populating animals:", error);
      throw error;
    }
  }

  static async populateAnimalTemperaments() {
    try {
      const data = await DatabaseService.readJsonFile(
        "animal_temperaments.json"
      );
      await DatabaseService.executeQuery(data.query);
      console.log("Animal temperaments data populated successfully");
    } catch (error) {
      console.error("Error populating animal temperaments:", error);
      throw error;
    }
  }
}

module.exports = AnimalService;
