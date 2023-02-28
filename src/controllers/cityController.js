const { userRoles } = require("../constants/users");
const {
  unAuthorizedError,
  NotFoundError,
} = require("../middleware/authenticationMiddleware");
const { sequelize } = require("../database/config");

//exports.getAllCities = (req, res) => res.send("getAllCities");

exports.getAllCities = async (req, res) => {
  let query;
  let options = {};
  if (req.user.role === userRoles.ADMIN) {
    console.log(req.user.role);
    query = `
      SELECT * FROM city`;
  }
  const [results, metadata] = await sequelize.query(query, options);
  return res.json(results);
};

/*   (exports.getCityById = async (req, res) => {}),
  (exports.deleteCityById = async (req, res) => {}),
  (exports.createNewCity = async (req, res) => {});
 */
