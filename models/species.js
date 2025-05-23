const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Species extends Model {
    static associate(models) {
      Species.hasMany(models.Animal, {
        foreignKey: "speciesId",
        as: "animals",
        sourceKey: "id",
      });
    }
  }

  Species.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      tableName: "Species",
      timestamps: true,
    }
  );

  return Species;
};
