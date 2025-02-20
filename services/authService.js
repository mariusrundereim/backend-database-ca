// services/authService.js
const db = require("../models");
const User = db.User;

class AuthService {
  static async verifyUser(username, password) {
    try {
      console.log("Attempting to verify user:", { username, password });

      // First, check if user exists
      const user = await User.findOne({
        where: { username },
        raw: true, // Get plain object
      });

      console.log("Database query result:", user);

      if (!user) {
        console.log("No user found with username:", username);
        return null;
      }

      // Check password
      if (user.password !== password) {
        console.log("Password mismatch for user:", username);
        return null;
      }

      console.log("User verified successfully:", username);
      return user;
    } catch (error) {
      console.error("Error in verifyUser:", error);
      throw error;
    }
  }

  static async createUser(userData) {
    try {
      const existingUser = await User.findOne({
        where: { username: userData.username },
      });

      if (existingUser) {
        throw new Error("Username already exists");
      }

      const user = await User.create(userData);
      console.log("New user created:", user.username);
      return user.get({ plain: true });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

module.exports = AuthService;

/*

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

*/
