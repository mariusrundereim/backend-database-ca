const SpeciesService = require("./speciesService");
const TemperamentService = require("./temperamentService");
const UserService = require("./userService");
const AnimalService = require("./animalService");
const db = require("../models");

class PopulationService {
  static async populateDatabase() {
    try {
      // Order matters due to foreign key relationships:
      // 1. Species (no dependencies)
      // 2. Temperaments (no dependencies)
      // 3. Users (no dependencies)
      // 4. Animals (depends on Species)
      // 5. Animal_Temperaments (depends on Animals and Temperaments)
      // 6. Adoptions (depends on Users and Animals)

      console.log("Starting database population in order...");

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
