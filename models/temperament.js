const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Temperament extends Model {
    static associate(models) {
      // Define associations with Animal (many-to-many)
      Temperament.belongsToMany(models.Animal, {
        through: "AnimalTemperaments",
        foreignKey: "temperamentId",
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
      },
    },
    {
      sequelize,
      modelName: "Temperament",
      timestamps: true,
    }
  );

  return Temperament;
};
