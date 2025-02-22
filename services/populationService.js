const db = require("../models");
const SpeciesService = require("./speciesService");
const TemperamentService = require("./temperamentService");
const UserService = require("./userService");
const AnimalService = require("./animalService");

class PopulationService {
  static async populateDatabase() {
    try {
      console.log("Starting database population...");

      // 1. First populate Users
      console.log("Step 1: Populating Users...");
      await UserService.populateUsers();
      const users = await db.User.findAll();
      console.log(
        "Users in database:",
        users.map((u) => ({ id: u.id, username: u.username, role: u.role }))
      );

      // 2. Then populate Species
      console.log("Step 2: Populating Species...");
      await SpeciesService.populateSpecies();
      const species = await db.Species.findAll();
      console.log(
        "Species in database:",
        species.map((s) => ({ id: s.id, name: s.name }))
      );

      // 3. Then populate Temperaments
      console.log("Step 3: Populating Temperaments...");
      await TemperamentService.populateTemperaments();
      const temperaments = await db.Temperament.findAll();
      console.log(
        "Temperaments in database:",
        temperaments.map((t) => ({ id: t.id, name: t.name }))
      );

      // 4. Then populate Animals
      console.log("Step 4: Populating Animals...");
      await AnimalService.populateAnimals();
      const animals = await db.Animal.findAll({
        include: [{ model: db.Species, as: "species" }],
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

*/
