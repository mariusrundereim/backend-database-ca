const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Animal extends Model {
    static associate(models) {
      // Define association with Adoption
      Animal.hasOne(models.Adoption, {
        foreignKey: "animalId",
        as: "adoption",
      });
      // Define association with Species
      Animal.belongsTo(models.Species, {
        foreignKey: "speciesId",
        as: "species",
      });
      // Define associations with Temperament (many-to-many)
      Animal.belongsToMany(models.Temperament, {
        through: "AnimalTemperaments",
        foreignKey: "animalId",
        as: "temperaments",
      });
    }
  }

  Animal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      size: {
        type: DataTypes.ENUM("Small", "Medium", "Large"),
        allowNull: false,
      },
      speciesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Animal",
      timestamps: true,
    }
  );

  return Animal;
};
