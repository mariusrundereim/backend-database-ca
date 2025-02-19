const db = require("../models");
const AuthService = require("../services/authService");
const fs = require("fs").promises;
const path = require("path");

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function initializeDatabase() {
  try {
    console.log("Starting database initialization...");

    // Sync database
    await db.sequelize.sync();
    console.log("Database schema synchronized");

    // Construct the file path
    const jsonPath = path.join(__dirname, "../public/json/users.json");
    console.log(`Looking for users file at: ${jsonPath}`);

    // Check if file exists
    const fileExists = await checkFileExists(jsonPath);
    if (!fileExists) {
      const alternativePath = path.join(__dirname, "../public/json/user.json");
      const alternativeExists = await checkFileExists(alternativePath);

      if (alternativeExists) {
        console.log("Found user.json instead of users.json");
        const jsonContent = await fs.readFile(alternativePath, "utf8");
        try {
          const userData = JSON.parse(jsonContent);
          console.log("Successfully parsed user data");

          // Execute the query
          await db.sequelize.query(userData.query);
          console.log("Users populated successfully");
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          throw parseError;
        }
      } else {
        throw new Error(
          "Neither users.json nor user.json found in the expected location"
        );
      }
    } else {
      // Original file exists, proceed as normal
      const jsonContent = await fs.readFile(jsonPath, "utf8");
      const userData = JSON.parse(jsonContent);
      await db.sequelize.query(userData.query);
      console.log("Users populated successfully");
    }

    // Create sessions directory if it doesn't exist
    const sessionsDir = path.join(__dirname, "../sessions");
    try {
      await fs.access(sessionsDir);
    } catch {
      await fs.mkdir(sessionsDir);
      console.log("Sessions directory created");
    }

    console.log("Database initialization completed successfully");
    return true;
  } catch (error) {
    console.error("Detailed error in database initialization:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw error;
  }
}

module.exports = initializeDatabase;
