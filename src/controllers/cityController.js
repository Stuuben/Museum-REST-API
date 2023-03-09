const { userRoles } = require("../constants/users");
const { NotFoundError } = require("../utils/error");
const { sequelize } = require("../database/config");
const { UnauthorizedError } = require("../utils/error");
const { QueryTypes } = require("sequelize");

exports.getAllCities = async (req, res) => {
  let query;
  let limit = req.query.limit || 10;
  const [results, metadata] = await sequelize.query(
    `
  SELECT * FROM city
  limit $limit
  `,
    {
      bind: {
        limit: limit,
      },
    }
  );
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
    throw new NotFoundError("We do not have this city listed on our site");

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
