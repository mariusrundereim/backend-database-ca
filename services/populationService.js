const SpeciesService = require("./speciesService");
const TemperamentService = require("./temperamentService");
const UserService = require("./userService");
const AnimalService = require("./animalService");
const db = require("../models");

class PopulationService {
  static async populateDatabase() {
    try {
      console.log("Starting database population...");

      // 1. First populate Species
      console.log("Step 1: Populating Species...");
      await SpeciesService.populateSpecies();

      // Verify Species were created
      const species = await db.Species.findAll();
      console.log(
        "Species in database:",
        species.map((s) => ({ id: s.id, name: s.name }))
      );

      // 2. Then populate Temperaments
      console.log("Step 2: Populating Temperaments...");
      await TemperamentService.populateTemperaments();

      // 3. Then populate Users
      console.log("Step 3: Populating Users...");
      await UserService.populateUsers();

      // 4. Then populate Animals
      console.log("Step 4: Populating Animals...");
      await AnimalService.populateAnimals();

      // Verify Animals were created
      const animals = await db.Animal.findAll({
        include: [
          {
            model: db.Species,
            as: "species",
          },
        ],
      });
      console.log(
        "Animals in database:",
        animals.map((a) => ({
          id: a.id,
          name: a.name,
          speciesId: a.speciesId,
          speciesName: a.species?.name,
        }))
      );

      // 5. Finally populate AnimalTemperaments
      console.log("Step 5: Populating Animal Temperaments...");
      await AnimalService.populateAnimalTemperaments();

      console.log("Database population completed successfully");
      return true;
    } catch (error) {
      console.error("Error in database population:", error.message);
      console.error("Stack trace:", error.stack);
      throw error;
    }
  }
}

module.exports = PopulationService;

/*

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


*/
