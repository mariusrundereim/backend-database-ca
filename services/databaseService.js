const fs = require("fs").promises;
const path = require("path");
const db = require("../models");

class DatabaseService {
  static async readJsonFile(fileName) {
    try {
      const jsonPath = path.join(__dirname, "../public/json", fileName);
      const fileContent = await fs.readFile(jsonPath, "utf8");
      return JSON.parse(fileContent.trim());
    } catch (error) {
      console.error(`Error reading ${fileName}:`, error);
      throw error;
    }
  }

  static async executeQuery(query) {
    try {
      await db.sequelize.query(query);
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}

module.exports = DatabaseService;
