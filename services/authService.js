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
