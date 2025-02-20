const DatabaseService = require("./databaseService");
const db = require("../models");

class AnimalService {
  static async populateAnimals() {
    try {
      console.log("Starting animal population...");
      const data = await DatabaseService.readJsonFile("animals.json");

      if (!data || !data.query) {
        throw new Error("Invalid animals.json format - missing query");
      }

      await DatabaseService.executeQuery(data.query);

      // Verify population
      const animals = await db.Animal.findAll();
      console.log(`Populated ${animals.length} animals successfully`);

      return animals;
    } catch (error) {
      console.error("Error populating animals:", error);
      throw error;
    }
  }

  static async populateAnimalTemperaments() {
    try {
      console.log("Starting animal temperaments population...");
      const data = await DatabaseService.readJsonFile(
        "animal_temperaments.json"
      );

      if (!data || !data.query) {
        throw new Error(
          "Invalid animal_temperaments.json format - missing query"
        );
      }

      await DatabaseService.executeQuery(data.query);

      // Verify population
      const temperaments = await db.sequelize.query(
        "SELECT * FROM AnimalTemperaments",
        { type: db.Sequelize.QueryTypes.SELECT }
      );
      console.log(
        `Populated ${temperaments.length} animal temperaments successfully`
      );

      return temperaments;
    } catch (error) {
      console.error("Error populating animal temperaments:", error);
      throw error;
    }
  }
}

module.exports = AnimalService;
