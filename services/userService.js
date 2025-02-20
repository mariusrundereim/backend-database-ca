const DatabaseService = require("./databaseService");
const db = require("../models");

class UserService {
  static async populateUsers() {
    try {
      const data = await DatabaseService.readJsonFile("users.json");
      await DatabaseService.executeQuery(data.query);
      console.log("Users data populated successfully");
    } catch (error) {
      console.error("Error populating users:", error);
      throw error;
    }
  }
}

module.exports = UserService;
