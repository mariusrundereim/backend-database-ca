const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Temperament extends Model {
    static associate(models) {
      Temperament.belongsToMany(models.Animal, {
        through: "AnimalTemperaments",
        foreignKey: "temperamentId",
        otherKey: "animalId", // explicitly define the other key
        as: "animals",
      });
    }
  }

  Temperament.init(
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
        field: "temperamentName", // explicitly name the database column
      },
    },
    {
      sequelize,
      modelName: "Temperament",
      tableName: "Temperaments",
      timestamps: true,
    }
  );

  return Temperament;
};
