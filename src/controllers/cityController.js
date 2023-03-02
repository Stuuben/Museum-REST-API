const { userRoles } = require("../constants/users");
const { NotFoundError } = require("../utils/error");
const { sequelize } = require("../database/config");
const { UnauthorizedError } = require("../utils/error");
const { QueryTypes } = require("sequelize");

//exports.getAllCities = (req, res) => res.send("getAllCities");

exports.getAllCities = async (req, res) => {
  let query;
  let options = {};
  if (req.user.role === userRoles.admin) {
    console.log(req.user.role);
    query = `
      SELECT * FROM city`;
  } else {
    throw new UnauthorizedError("Unauthorized Access");
  }
  const [results, metadata] = await sequelize.query(query, options);
  return res.json(results);
};

exports.getCityById = async (req, res) => {
  // Grab the user id and place in local variable
  const cityId = req.params.cityId;

  // Get the user from the database (NOTE: excluding password)
  const [city, metadata] = await sequelize.query(
    "SELECT * FROM city WHERE id = $cityId",
    {
      bind: { cityId },
      type: QueryTypes.SELECT,
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!city || city.length == 0)
    throw new NotFoundError("There is no museum in this city");

  // Send back user info
  return res.json(city);
};

exports.createNewCity = async (req, res) => {
  //gör if sats för om staden redan finns
  const { name } = req.body;

  const [newCityId] = await sequelize.query(
    "INSERT INTO city (name) VALUES ($cityName);",
    {
      bind: { cityName: name },
      type: QueryTypes.INSERT, // returns ID of created row
    }
  );
  // prettier-ignore
  return res
    .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/cities/${newCityId}`)
    .sendStatus(201);
};

exports.deleteCityById = async (req, res) => {
  // Grab the user id and place in local variable
  const cityId = req.params.cityId;

  // Check if user is admin || user is requesting to delete themselves
  if (
    cityId != req.city?.cityId &&
    req.user.role !== userRoles.admin &&
    req.user.role !== userRoles.owner
  ) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  // Delete the user from the database
  const [city, metadata] = await sequelize.query(
    "DELETE FROM city WHERE id = $cityId RETURNING *",
    {
      bind: { cityId },
      type: QueryTypes.SELECT,
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!city || city.length == 0) new NotFoundError("That city does not exist");

  // Send back user info
  return res.json(city);
};
