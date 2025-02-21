const express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const { Animal, User, Adoption, Species, Temperament } = require("../models");
const { isAuthenticated, isAdmin, isMember } = require("../middlewares/auth");

// Helper function to calculate age
const calculateAge = (birthday) => {
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Get all animals
router.get("/", async (req, res) => {
  try {
    const animals = await Animal.findAll({
      include: [
        {
          model: Species,
          as: "species",
          attributes: ["name"],
        },
        {
          model: Temperament,
          as: "temperaments",
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: Adoption,
          as: "adoption",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    const formattedAnimals = animals.map((animal) => {
      const animalData = animal.get({ plain: true });
      return {
        Id: animalData.id,
        Name: animalData.name,
        Species: animalData.species ? animalData.species.name : "",
        Birthday: animalData.birthday,
        Temperament: animalData.temperaments
          ? animalData.temperaments.map((t) => t.name).join(", ")
          : "",
        Size: animalData.size,
        Age: calculateAge(animalData.birthday),
        Adopted: animalData.adoption ? true : false,
      };
    });

    res.render("animals", {
      user: req.user || null,
      animals: formattedAnimals,
    });
  } catch (error) {
    console.error("Error in /animals route:", error);
    res.status(500).send(error.message);
  }
});

// Adopt an animal - requires member role
router.post("/adopt/:id", isMember, async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      include: [
        {
          model: Adoption,
          as: "adoption",
        },
      ],
    });

    if (!animal) {
      return res.status(404).send("Animal not found");
    }

    if (animal.adoption) {
      return res.status(400).send("Animal is already adopted");
    }

    await Adoption.create({
      animalId: animal.id,
      userId: req.user.id,
      adoptionDate: new Date(),
    });

    res.status(200).send("Animal adopted successfully");
  } catch (error) {
    console.error("Error in adopt route:", error);
    res.status(500).send(error.message);
  }
});

// Cancel adoption - requires admin role
router.post("/cancel-adoption/:id", isAdmin, async (req, res) => {
  try {
    const adoption = await Adoption.findOne({
      where: { animalId: req.params.id },
    });

    if (!adoption) {
      return res.status(404).send("Adoption record not found");
    }

    await adoption.destroy();
    res.status(200).send("Adoption cancelled successfully");
  } catch (error) {
    console.error("Error in cancel-adoption route:", error);
    res.status(500).send(error.message);
  }
});

// SQL Query 1: Popular Animal Names
router.get("/popular-names", async (req, res) => {
  try {
    const popularNames = await Animal.findAll({
      attributes: [
        "name",
        [Sequelize.fn("COUNT", Sequelize.col("name")), "count"],
      ],
      group: ["name"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("name")), "DESC"]],
    });
    res.json(popularNames);
  } catch (error) {
    console.error("Error in popular-names route:", error);
    res.status(500).send(error.message);
  }
});

// SQL Query 2: All Adoption Details
router.get("/adoption-details", async (req, res) => {
  try {
    const adoptions = await Adoption.findAll({
      include: [
        {
          model: Animal,
          as: "animal",
          include: [
            {
              model: Species,
              as: "species",
            },
          ],
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
    res.json(adoptions);
  } catch (error) {
    console.error("Error in adoption-details route:", error);
    res.status(500).send(error.message);
  }
});

// SQL Query 3: Animals By Age
router.get("/by-age", async (req, res) => {
  try {
    const animals = await Animal.findAll({
      order: [["birthday", "ASC"]],
      include: [
        {
          model: Species,
          as: "species",
        },
      ],
    });

    const animalsWithAge = animals.map((animal) => ({
      ...animal.get({ plain: true }),
      age: calculateAge(animal.birthday),
    }));

    res.json(animalsWithAge);
  } catch (error) {
    console.error("Error in by-age route:", error);
    res.status(500).send(error.message);
  }
});

// SQL Query 4: Animals Born in Date Range
router.get("/in-date-range", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const animals = await Animal.findAll({
      where: {
        birthday: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Species,
          as: "species",
        },
      ],
    });
    res.json(animals);
  } catch (error) {
    console.error("Error in in-date-range route:", error);
    res.status(500).send(error.message);
  }
});

// SQL Query 5: Number of Animals Per Size (Admin only)
router.get("/by-size", isAdmin, async (req, res) => {
  try {
    const animalsBySize = await Animal.findAll({
      attributes: [
        "size",
        [Sequelize.fn("COUNT", Sequelize.col("size")), "count"],
      ],
      group: ["size"],
    });
    res.json(animalsBySize);
  } catch (error) {
    console.error("Error in by-size route:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
