const fs = require("fs").promises;
const path = require("path");
const db = require("../models");

class DatabaseService {
  static async readJsonFile(fileName) {
    try {
      const jsonPath = path.join(__dirname, "../public/json", fileName);
      console.log(`Reading JSON file: ${jsonPath}`);

      const fileContent = await fs.readFile(jsonPath, "utf8");
      const jsonData = JSON.parse(fileContent.trim());

      // Verify JSON structure
      if (!jsonData.query) {
        throw new Error(
          `Invalid JSON structure in ${fileName} - missing query property`
        );
      }

      return jsonData;
    } catch (error) {
      console.error(`Error reading ${fileName}:`, error);
      throw error;
    }
  }

  static async executeQuery(query) {
    try {
      console.log("Executing query:", query);
      const result = await db.sequelize.query(query, {
        type: db.Sequelize.QueryTypes.INSERT,
      });
      return result;
    } catch (error) {
      console.error("Query execution error:", error);
      throw error;
    }
  }
}

module.exports = DatabaseService;
