const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("museum", "", "", {
  dialect: "sqlite",
  storage: path.join(__dirname, "museum.sqlite"),
});

module.exports = { sequelize };
