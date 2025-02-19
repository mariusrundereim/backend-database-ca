const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Species extends Model {
    static associate(models) {
      // Define association with Animal
      Species.hasMany(models.Animal, {
        foreignKey: "speciesId",
        as: "animals",
      });
    }
  }

  Species.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Species",
      timestamps: true,
    }
  );

  return Species;
};
