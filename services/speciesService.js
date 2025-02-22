const Species = require("../models/species");
const Animal = require("../models/animal");
const DatabaseService = require("./databaseService");

class SpeciesService {
  // Static method for populating species
  static async populateSpecies() {
    try {
      const speciesQueries = await DatabaseService.readJsonFile("species.json");

      // If it's an object with numbered keys, convert to array
      const queriesArray = Array.isArray(speciesQueries)
        ? speciesQueries
        : Object.values(speciesQueries);

      // Debug log to see what we're working with
      console.log("Queries to execute:", queriesArray);

      for (const queryData of queriesArray) {
        if (queryData && queryData.query) {
          await Species.sequelize.query(queryData.query);
        } else {
          console.warn("Invalid query data:", queryData);
        }
      }

      console.log("Species data populated successfully");
    } catch (error) {
      console.error("Error populating species:", error);
      throw error;
    }
  }

  // Instance methods for CRUD operations
  async getAllSpecies() {
    return await Species.findAll({
      order: [["name", "ASC"]],
    });
  }

  async addSpecies(name) {
    return await Species.create({
      name: name,
    });
  }

  async updateSpecies(id, name) {
    const species = await Species.findByPk(id);
    if (!species) {
      throw new Error("Species not found");
    }
    return await species.update({ name: name });
  }

  async deleteSpecies(id) {
    // Check if species is being used by any animals
    const animalsWithSpecies = await Animal.findOne({
      where: { species_id: id },
    });

    if (animalsWithSpecies) {
      throw new Error("Cannot delete species that has dependent animals");
    }

    const species = await Species.findByPk(id);
    if (!species) {
      throw new Error("Species not found");
    }

    return await species.destroy();
  }
}

module.exports = SpeciesService;
module.exports.instance = new SpeciesService();

/*
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


*/
