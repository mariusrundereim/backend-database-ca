const express = require("express");
const router = express.Router();
const { instance: speciesService } = require("../services/speciesService");
const { isAdmin } = require("../middlewares/auth");

// GET all species (accessible by all)
router.get("/", async function (req, res, next) {
  try {
    const species = await speciesService.getAllSpecies();
    res.render("species", {
      user: req.user,
      species: species,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    next(error);
  }
});

// Add new species (admin only)
router.post("/add", isAdmin, async function (req, res, next) {
  try {
    const { name } = req.body;
    if (!name) {
      req.flash("error", "Species name is required");
      return res.redirect("/species");
    }

    await speciesService.addSpecies(name);
    req.flash("success", "Species added successfully");
    res.redirect("/species");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/species");
  }
});

// Update species (admin only)
router.post("/update/:id", isAdmin, async function (req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      req.flash("error", "Species name is required");
      return res.redirect("/species");
    }

    await speciesService.updateSpecies(id, name);
    req.flash("success", "Species updated successfully");
    res.redirect("/species");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/species");
  }
});

// Delete species (admin only)
router.post("/delete/:id", isAdmin, async function (req, res, next) {
  try {
    const { id } = req.params;
    await speciesService.deleteSpecies(id);
    req.flash("success", "Species deleted successfully");
    res.redirect("/species");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/species");
  }
});

module.exports = router;

/*

var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    species = [
        {
            Id: 1,
            Name: "Tedy bear hamster"
        },
        {
            Id: 2,
            Name: "Jack-Russel"
        }
    ]
    res.render("species", {user: null})
})

router.post('/update', async function (req,res,next){
    res.render("index",{user: null})
})

module.exports = router;


*/
