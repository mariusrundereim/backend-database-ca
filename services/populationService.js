const SpeciesService = require("./speciesService");
const TemperamentService = require("./temperamentService");
const UserService = require("./userService");
const AnimalService = require("./animalService");
const db = require("../models");

class PopulationService {
  static async populateDatabase() {
    try {
      // Populate in correct order due to foreign key constraints
      await SpeciesService.populateSpecies();
      await TemperamentService.populateTemperaments();
      await UserService.populateUsers();
      await AnimalService.populateAnimals();
      await AnimalService.populateAnimalTemperaments();

      console.log("Database populated successfully");
      return true;
    } catch (error) {
      console.error("Error in database population:", error);
      throw error;
    }
  }
}

module.exports = PopulationService;
