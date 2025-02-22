const DatabaseService = require("./databaseService");
const db = require("../models");

class SpeciesService {
  // Static method for population
  static async populateSpecies() {
    try {
      console.log("Starting species population...");
      const existingSpecies = await db.Species.findAll();
      console.log(
        "Current species:",
        existingSpecies.map((s) => s.name)
      );

      const data = await DatabaseService.readJsonFile("species.json");
      console.log("Species population query:", data.query);
      await DatabaseService.executeQuery(data.query, {
        type: db.Sequelize.QueryTypes.INSERT,
      });

      const speciesAfter = await db.Species.findAll();
      console.log("Species after population:", speciesAfter);
      return true;
    } catch (error) {
      console.error("Detailed error in populateSpecies:", error);
      throw error;
    }
  }

  // Instance methods
  async getAllSpecies() {
    try {
      return await db.Species.findAll({
        order: [["name", "ASC"]],
      });
    } catch (error) {
      console.error("Error getting all species:", error);
      throw error;
    }
  }

  async addSpecies(name) {
    return await db.Species.create({
      name: name,
    });
  }

  async updateSpecies(id, name) {
    const species = await db.Species.findByPk(id);
    if (!species) {
      throw new Error("Species not found");
    }
    return await species.update({ name: name });
  }

  async deleteSpecies(id) {
    const animalsWithSpecies = await db.Animal.findOne({
      where: { speciesId: id },
    });

    if (animalsWithSpecies) {
      throw new Error("Cannot delete species that has dependent animals");
    }

    const species = await db.Species.findByPk(id);
    if (!species) {
      throw new Error("Species not found");
    }

    return await species.destroy();
  }
}

// Create and export instance for routes to use
const speciesService = new SpeciesService();

// Export static and instance methods
module.exports = SpeciesService;
module.exports.instance = speciesService;
