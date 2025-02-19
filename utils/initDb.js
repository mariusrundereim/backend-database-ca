// utils/initDb.js
const db = require("../models");
const AuthService = require("../services/authService");
const fs = require("fs"); // Regular fs for sync operations
const fsPromises = require("fs").promises; // Promises version for async operations
const path = require("path");

async function initializeDatabase() {
  try {
    // Sync database
    await db.sequelize.sync();

    // Read and execute users.json query
    const jsonPath = path.join(__dirname, "../public/json/users.json");
    const jsonContent = await fsPromises.readFile(jsonPath, "utf8");
    const userData = JSON.parse(jsonContent);

    // Execute the query
    await db.sequelize.query(userData.query);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Create sessions directory if it doesn't exist
const sessionsDir = path.join(__dirname, "../sessions");
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir);
}

module.exports = initializeDatabase;
