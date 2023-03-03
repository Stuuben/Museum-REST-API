const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const { UnauthorizedError, NotFoundError } = require("../utils/error");

exports.getAllMuseums = async (req, res) => {
  // VAD ÄR QUERY / OPTIONS / METADATA ?? fråga petter
  let query;
  let options = {};

  query = `
    SELECT  m.id, m.name, m.address, m.zipcode, m.fee, c.name AS city, fk_city_id 
FROM museum m
JOIN city c ON c.id = m.fk_city_id

    `;

  const [results, metadata] = await sequelize.query(query, options);
  return res.json(results);
};

exports.getMuseumById = async (req, res) => {
  const museumId = req.params.museumId;

  const [museum, metadata] = await sequelize.query(
    `
    SELECT  m.id, m.name, m.address, m.zipcode, m.fee, c.name AS city, fk_city_id 
FROM museum m
JOIN city c ON c.id = m.fk_city_id
WHERE m.id = $museumId


 `,
    {
      bind: {
        museumId,
      },
      type: QueryTypes.SELECT,
    }
  );
  console.log(museum);

  if (!museum || museum.length == 0)
    throw new NotFoundError("That museum does not exist");

  return res.json(museum);
};

exports.createNewMuseum = async (req, res) => {
  const { name, address, zipcode, fk_city_id, fee } = req.body;

  if (req.user.role == userRoles.admin || req.user.role == userRoles.owner) {
    const [NewMuseumId] = await sequelize.query(
      `
    INSERT INTO museum (name, address, zipcode, fk_city_id, fee) VALUES (
      $name, $address, $zipcode, $fk_city_id, $fee
    );
    `,
      {
        bind: {
          name: name,
          address: address,
          zipcode: zipcode,
          fk_city_id: fk_city_id,
          fee: fee,
        },
        type: QueryTypes.INSERT,
      }
    );

    return res
      .setHeader(
        "Location",
        `${req.protocol}://${req.headers.host}/api/v1/museums/${NewMuseumId}`
      )
      .sendStatus(201);
  } else {
    throw new UnauthorizedError("You are not allowed to perform this action");
  }
};

exports.updateMuseumById = async (req, res) => {
  const museumId = req.params.museumId;
  const { name, address, zipcode, fk_city_id, fee } = req.body;

  if (req.user.role == userRoles.admin || req.user.role == userRoles.owner) {
    const [updatedMuseum] = await sequelize.query(
      `
    UPDATE museum
    SET name = $name, address = $address, zipcode = $zipcode, fk_city_id = $fk_city_id, fee = $fee
    WHERE museum.id = ${museumId};
    `,
      {
        bind: {
          name: name,
          address: address,
          zipcode: zipcode,
          fk_city_id: fk_city_id,
          fee: fee,
        },
        type: QueryTypes.INSERT,
      }
    );

    return res
      .setHeader(
        "Location",
        `${req.protocol}://${req.headers.host}/api/v1/museums/${updatedMuseum}`
      )
      .sendStatus(201);
  } else {
    throw new UnauthorizedError("You are not allowed to perform this action");
  }
};

exports.deleteMuseumById = async (req, res) => {
  const museumId = req.params.museumId;

  if (
    museumId != req.museum?.museumId &&
    req.user.role !== userRoles.admin &&
    req.user.role !== userRoles.owner
  ) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  const [museum, metadata] = await sequelize.query(
    "DELETE FROM museum WHERE id = $museumId RETURNING *",
    {
      bind: { museumId },
      type: QueryTypes.SELECT,
    }
  );

  if (!museumId) new NotFoundError("That museum does not exist");

  return res.json(museumId);
};
