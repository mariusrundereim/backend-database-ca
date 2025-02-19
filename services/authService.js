const db = require("../models");
const User = db.User;

class AuthService {
  static async verifyUser(username, password) {
    try {
      const user = await User.findOne({
        where: {
          username: username,
          password: password, // Note: In production, use proper password hashing
        },
      });
      return user ? user.get({ plain: true }) : null;
    } catch (error) {
      console.error("Error verifying user:", error);
      throw error;
    }
  }

  static async createUser(userData) {
    try {
      const user = await User.create(userData);
      return user.get({ plain: true });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async populateInitialUsers() {
    try {
      const initialUsers = [
        {
          fullName: "System Admin",
          username: "Admin",
          password: "admin1234",
          role: "admin",
        },
        {
          fullName: "User",
          username: "User",
          password: "user1234",
          role: "member",
        },
        {
          fullName: "User2",
          username: "User2",
          password: "User1234",
          role: "member",
        },
      ];

      for (const userData of initialUsers) {
        const existingUser = await User.findOne({
          where: { username: userData.username },
        });

        if (!existingUser) {
          await User.create(userData);
        }
      }

      console.log("Initial users populated successfully");
    } catch (error) {
      console.error("Error populating initial users:", error);
      throw error;
    }
  }
}

module.exports = AuthService;
