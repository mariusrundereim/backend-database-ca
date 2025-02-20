const db = require("../models");

async function checkDatabase() {
  try {
    // Check Users table
    const users = await db.User.findAll();
    console.log(
      "\nCurrent Users:",
      users.map((u) => ({
        username: u.username,
        role: u.role,
      }))
    );

    // Try direct query
    const [rawUsers] = await db.sequelize.query("SELECT * FROM Users", {
      type: db.Sequelize.QueryTypes.SELECT,
    });
    console.log("\nRaw Users Query Result:", rawUsers);
  } catch (error) {
    console.error("Database check error:", error);
  }
}

module.exports = checkDatabase;
