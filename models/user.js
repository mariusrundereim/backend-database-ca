const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: DataTypes.STRING,
  username: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM("admin", "member"),
    defaultValue: "member",
  },
});
