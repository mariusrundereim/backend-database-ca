const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Adoption extends Model {
    static associate(models) {
      // Define association with User model
      Adoption.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      // Define association with Animal model
      Adoption.belongsTo(models.Animal, {
        foreignKey: "animalId",
        as: "animal",
      });
    }
  }

  Adoption.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      animalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Animals",
          key: "id",
        },
      },
      adoptionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Adoption",
      timestamps: true,
    }
  );

  return Adoption;
};
