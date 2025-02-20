const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../models");
const User = db.User;
const fs = require("fs").promises;
const path = require("path");
const AuthService = require("../services/authService");

// Login page render
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// Signup page render
router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

// Sign-up route
router.post("/signup", async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body;
    const fullName = `${firstname} ${lastname}`;

    const userData = {
      fullName,
      username,
      password,
      role: "member",
    };

    await AuthService.createUser(userData);
    req.flash("success", "Account created successfully. Please log in.");
    res.redirect("/login");
  } catch (error) {
    console.error("Error in signup:", error);
    req.flash("error", "Error creating account");
    res.redirect("/signup");
  }
});

// Login route
router.post(
  "/login/password",
  (req, res, next) => {
    console.log("Login attempt:", req.body);
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/animals",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

/*
router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/animals",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    if (req.user && req.user.role === "admin") {
      console.log(
        `Admin user ${
          req.user.username
        } accessed the application at ${new Date()}`
      );
    }
  }
);
*/

// Logout route - Changed to POST to match the form
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Function to populate users from JSON
async function populateUsers() {
  try {
    const jsonPath = path.join(__dirname, "../public/json/users.json");
    const jsonContent = await fs.readFile(jsonPath, "utf8");
    const userData = JSON.parse(jsonContent);

    // Execute the query using Sequelize raw query
    await db.sequelize.query(userData.query);
    console.log("Users populated successfully");
  } catch (error) {
    console.error("Error populating users:", error);
  }
}

// Route to populate database
router.post("/populate", async (req, res) => {
  try {
    await populateUsers();
    res.json({ message: "Database populated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error populating database" });
  }
});

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Changed from /signin to /login to match your routes
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).send("Access denied");
};

// routes/auth.js - Add this route for debugging
router.get("/check-users", async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ["username", "role", "createdAt"],
    });

    res.json({
      count: users.length,
      users: users.map((u) => ({
        username: u.username,
        role: u.role,
        created: u.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  router,
  isAuthenticated,
  isAdmin,
};
