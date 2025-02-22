const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Species extends Model {
    static associate(models) {
      Species.hasMany(models.Animal, {
        foreignKey: "speciesId",
        as: "animals",
        sourceKey: "id", // explicitly define the source key
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
        field: "speciesName", // Match
      },
    },
    {
      sequelize,
      modelName: "Species",
      tableName: "Species", // explicitly define table name
      timestamps: true,
    }
  );

  return Species;
};
