const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const { UnauthorizedError, NotFoundError } = require("../utils/error");

exports.getAllMuseums = async (req, res) => {
  let query;
  let options = {};
  if (req.user.role === userRoles.admin) {
    query = `
      SELECT museum.id AS museumId, museum.name, museum.address, museum.fee FROM museum
      LEFT JOIN city ON museum.id = city.fk_museum_id 
      LEFT JOIN review ON museum.id = review.fk_museum_id 
    `;
  } /*else {
		query = `
      SELECT lists.id AS listId, lists.name, roles.role_name FROM lists 
      LEFT JOIN users_lists ON lists.id = users_lists.fk_lists_id 
      LEFT JOIN roles ON roles.id = users_lists.fk_roles_id
      WHERE users_lists.fk_users_id = $userId;
    `
		options.bind = { userId: req.user.userId }
	}*/
  const [results, metadata] = await sequelize.query(query, options);

  return res.json(results);
};
