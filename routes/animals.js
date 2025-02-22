const express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const { Animal, User, Adoption, Species, Temperament } = require("../models");
const { isAuthenticated, isAdmin, isMember } = require("../middlewares/auth");

// Helper function to calculate age
const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// Get all animals
router.get("/", async (req, res) => {
  try {
    const { query, startDate, endDate } = req.query;
    let animals;

    switch (query) {
      case "popular-names":
        animals = await Animal.findAll({
          include: [
            { model: Species, as: "species" },
            { model: Temperament, as: "temperaments" },
            { model: Adoption, as: "adoption" },
          ],
          attributes: {
            include: [
              [Sequelize.fn("COUNT", Sequelize.col("name")), "nameCount"],
            ],
          },
          group: [
            "Animal.id",
            "Animal.name",
            "Animal.birthday",
            "Animal.size",
            "Animal.speciesId",
            "species.id",
            "species.name",
          ],
          order: [[Sequelize.fn("COUNT", Sequelize.col("name")), "DESC"]],
        });
        break;

      case "adoption-details":
        animals = await Animal.findAll({
          include: [
            { model: Species, as: "species" },
            { model: Temperament, as: "temperaments" },
            {
              model: Adoption,
              as: "adoption",
              include: [{ model: User, as: "user" }],
            },
          ],
        });
        break;

      case "by-age":
        animals = await Animal.findAll({
          include: [
            { model: Species, as: "species" },
            { model: Temperament, as: "temperaments" },
            { model: Adoption, as: "adoption" },
          ],
          order: [["birthday", "ASC"]],
        });
        break;

      case "date-range":
        animals = await Animal.findAll({
          where: {
            birthday: {
              [Op.between]: [startDate, endDate],
            },
          },
          include: [
            { model: Species, as: "species" },
            { model: Temperament, as: "temperaments" },
            { model: Adoption, as: "adoption" },
          ],
        });
        break;

      case "by-size":
        if (req.user?.role !== "admin") {
          return res.status(403).send("Admin access required");
        }
        animals = await Animal.findAll({
          include: [
            { model: Species, as: "species" },
            { model: Temperament, as: "temperaments" },
            { model: Adoption, as: "adoption" },
          ],
          group: ["size"],
          attributes: {
            include: [
              [Sequelize.fn("COUNT", Sequelize.col("size")), "sizeCount"],
            ],
          },
        });
        break;

      default:
        animals = await Animal.findAll({
          include: [
            { model: Species, as: "species" },
            { model: Temperament, as: "temperaments" },
            { model: Adoption, as: "adoption" },
          ],
        });
    }

    const formattedAnimals = animals.map((animal) => {
      const plainAnimal = animal.get({ plain: true });
      const age = calculateAge(plainAnimal.birthday);

      let displayAge = `${age} years`;
      if (query === "popular-names" && plainAnimal.nameCount) {
        displayAge = `${plainAnimal.nameCount} occurrences`;
      } else if (query === "by-size" && plainAnimal.sizeCount) {
        displayAge = `${plainAnimal.sizeCount} animals`;
      }

      return {
        Id: plainAnimal.id,
        Name: plainAnimal.name,
        Species: plainAnimal.species?.name || "",
        Birthday: plainAnimal.birthday,
        Temperament:
          plainAnimal.temperaments?.map((t) => t.name).join(", ") || "",
        Size: plainAnimal.size,
        Age: displayAge,
        Adopted: plainAnimal.adoption ? true : false,
      };
    });

    res.render("animals", {
      user: req.user || null,
      animals: formattedAnimals,
    });
  } catch (error) {
    console.error("Error in animals route:", error);
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
    // First check if the animal exists and if it's adopted
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

    if (!animal.adoption) {
      return res.status(400).send("This animal is not currently adopted");
    }

    // Now we can safely delete the adoption record
    await animal.adoption.destroy();
    res.status(200).send("Adoption cancelled successfully");
  } catch (error) {
    console.error("Error in cancel-adoption route:", error, error.stack);
    res.status(500).send(error.message);
  }
});

// Helper function to format animal data consistently
const formatAnimalData = (animal) => {
  const animalData = animal.get({ plain: true });
  const age = calculateAge(animalData.birthday);
  return {
    Id: animalData.id,
    Name: animalData.name,
    Species: animalData.species ? animalData.species.name : "",
    Birthday: animalData.birthday,
    Temperament: animalData.temperaments
      ? animalData.temperaments.map((t) => t.name).join(", ")
      : "",
    Size: animalData.size,
    Age: `${age} year${age !== 1 ? "s" : ""}`,
    Adopted: animalData.adoption ? true : false,
  };
};

// SQL Query 1: Popular Animal Names
router.get("/popular-names", async (req, res) => {
  try {
    const [results] = await sequelize.query(
      `
      SELECT 
        name,
        COUNT(*) as occurrence_count
      FROM Animals
      GROUP BY name
      ORDER BY occurrence_count DESC
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const formattedResults = results.map((result) => ({
      Name: result.name,
      Occurrences: result.occurrence_count,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error("Error in popular-names route:", error);
    res.status(500).send(error.message);
  }
});

// SQL Query 2: All Adoption Details
router.get("/adoption-details", async (req, res) => {
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

    const formattedAnimals = animals.map(formatAnimalData);
    console.log("Formatted adoptions:", formattedAnimals); // Debug log
    res.json(formattedAnimals);
  } catch (error) {
    console.error("Error in adoption-details route:", error);
    res.status(500).send(error.message);
  }
});

// SQL Query 3: Animals By Age
router.get("/by-age", async (req, res) => {
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
        },
      ],
      order: [["birthday", "ASC"]],
    });

    const formattedAnimals = animals.map(formatAnimalData);
    console.log("Formatted animals by age:", formattedAnimals); // Debug log
    res.json(formattedAnimals);
  } catch (error) {
    console.error("Error in by-age route:", error);
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
        },
      ],
    });

    const formattedAnimals = animals.map((animal) => {
      const animalData = animal.get({ plain: true });
      const age = calculateAge(animalData.birthday);
      return {
        Id: animalData.id,
        Name: animalData.name,
        Species: animalData.species ? animalData.species.name : "",
        Birthday: new Date(animalData.birthday).toLocaleDateString(),
        Temperament: animalData.temperaments
          ? animalData.temperaments.map((t) => t.name).join(", ")
          : "",
        Size: animalData.size,
        Age: `${age} year${age !== 1 ? "s" : ""}`,
        Adopted: animalData.adoption ? true : false,
      };
    });

    res.json(formattedAnimals);
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

/*

const express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const { Animal, User, Adoption, Species, Temperament } = require("../models");
const { isAuthenticated, isAdmin, isMember } = require("../middlewares/auth");

// Helper function to calculate age
const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
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
          through: { attributes: [] }, // Exclude junction table attributes
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
      const age = calculateAge(animalData.birthday);
      return {
        Id: animalData.id,
        Name: animalData.name,
        Species: animalData.species ? animalData.species.name : "",
        Birthday: animalData.birthday,
        Temperament: animalData.temperaments
          ? animalData.temperaments.map((t) => t.name).join(", ")
          : "",
        Size: animalData.size,
        Age: `${age} year${age !== 1 ? "s" : ""}`,
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
    // First check if the animal exists and if it's adopted
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

    if (!animal.adoption) {
      return res.status(400).send("This animal is not currently adopted");
    }

    // Now we can safely delete the adoption record
    await animal.adoption.destroy();
    res.status(200).send("Adoption cancelled successfully");
  } catch (error) {
    console.error("Error in cancel-adoption route:", error, error.stack);
    res.status(500).send(error.message);
  }
});

// SQL Query 1: Popular Animal Names
router.get("/popular-names", async (req, res) => {
  try {
    const animals = await Animal.findAll({
      attributes: [
        "id",
        "name",
        "birthday",
        "size",
        [Sequelize.fn("COUNT", Sequelize.col("name")), "count"],
      ],
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
        },
      ],
      group: [
        "Animal.name",
        "Animal.id",
        "Animal.birthday",
        "Animal.size",
        "species.id",
        "species.name",
      ],
      order: [[Sequelize.fn("COUNT", Sequelize.col("name")), "DESC"]],
    });

    const formattedAnimals = animals.map((animal) => {
      const animalData = animal.get({ plain: true });
      const age = calculateAge(animalData.birthday);
      return {
        Id: animalData.id,
        Name: animalData.name,
        Species: animalData.species ? animalData.species.name : "",
        Birthday: animalData.birthday,
        Temperament: animalData.temperaments
          ? animalData.temperaments.map((t) => t.name).join(", ")
          : "",
        Size: animalData.size,
        Age: `${age} year${age !== 1 ? "s" : ""}`,
        Adopted: animalData.adoption ? true : false,
        Count: animalData.count,
      };
    });

    res.json(formattedAnimals);
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
        },
      ],
    });

    const formattedAnimals = animals.map((animal) => {
      const animalData = animal.get({ plain: true });
      const age = calculateAge(animalData.birthday);
      return {
        Id: animalData.id,
        Name: animalData.name,
        Species: animalData.species ? animalData.species.name : "",
        Birthday: new Date(animalData.birthday).toLocaleDateString(),
        Temperament: animalData.temperaments
          ? animalData.temperaments.map((t) => t.name).join(", ")
          : "",
        Size: animalData.size,
        Age: `${age} year${age !== 1 ? "s" : ""}`,
        Adopted: animalData.adoption ? true : false,
      };
    });

    res.json(formattedAnimals);
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

*/
