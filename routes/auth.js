// routes/auth.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models");

// Sign-up route
router.post("/signup", async (req, res) => {
  try {
    const { fullName, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new user
    const newUser = await User.create({
      fullName,
      username,
      password, // In production, hash this password
      role: "member", // Default role
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/animals",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).send("Access denied");
};

module.exports = {
  router,
  isAuthenticated,
  isAdmin,
};
