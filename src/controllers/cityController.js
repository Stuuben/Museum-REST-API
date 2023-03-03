const { userRoles } = require("../constants/users");
const { NotFoundError } = require("../utils/error");
const { sequelize } = require("../database/config");
const { UnauthorizedError } = require("../utils/error");
const { QueryTypes } = require("sequelize");

exports.getAllCities = async (req, res) => {
  let query;
  let options = {};
  //if (req.user.role === userRoles.admin)S
  query = `
      SELECT * FROM city
      `;
  const [results, metadata] = await sequelize.query(query, options);
  return res.json(results);
};

exports.getCityById = async (req, res) => {
  const cityId = req.params.cityId;

  const [city, metadata] = await sequelize.query(
    "SELECT * FROM city WHERE id = $cityId",
    {
      bind: { cityId },
      type: QueryTypes.SELECT,
    }
  );

  if (!city || city.length == 0)
    throw new NotFoundError("There do not have this city listed on our site");

  return res.json(city);
};

exports.createNewCity = async (req, res) => {
  const { name } = req.body;

  const [newCityId] = await sequelize.query(
    "INSERT INTO city (name) VALUES ($cityName);",
    {
      bind: { cityName: name },
      type: QueryTypes.INSERT,
    }
  );
  // prettier-ignore
  return res
    .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/cities/${newCityId}`)
    .sendStatus(201);
};

exports.deleteCityById = async (req, res) => {
  const cityId = req.params.cityId;

  if (
    cityId != req.city?.cityId &&
    req.user.role !== userRoles.admin &&
    req.user.role !== userRoles.owner
  ) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  const [city, metadata] = await sequelize.query(
    "DELETE FROM city WHERE id = $cityId RETURNING *",
    {
      bind: { cityId },
      type: QueryTypes.SELECT,
    }
  );

  query =
    ("SELECT * FROM city WHERE id = $cityId",
    {
      bind: { cityId },
      type: QueryTypes.SELECT,
    });

  if (!city || city.length == 0) new NotFoundError("That city does not exist"); //DETTA FELMEDDELANDE KOMMER INTE FRAM NÄR VI RADERAR STAD SOM INTE FINNS. FRÅGA PETTER

  return res.json(city);
};
