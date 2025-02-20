const DatabaseService = require("./databaseService");
const db = require("../models");

class UserService {
  static async populateUsers() {
    try {
      console.log("Starting user population...");

      // Check current state
      const existingUsers = await db.User.findAll();
      console.log(
        "Current users:",
        existingUsers.map((u) => u.username)
      );

      // Read and execute query
      const data = await DatabaseService.readJsonFile("users.json");
      console.log("User population query:", data.query);

      await DatabaseService.executeQuery(data.query, {
        type: db.Sequelize.QueryTypes.INSERT,
      });

      // Verify population
      const usersAfter = await db.User.findAll();
      console.log(
        "Users after population:",
        usersAfter.map((u) => ({
          username: u.username,
          role: u.role,
        }))
      );

      return true;
    } catch (error) {
      console.error("Detailed error in populateUsers:", error);
      throw error;
    }
  }
}

module.exports = UserService;
