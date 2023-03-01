const { NotFoundError, UnauthorizedError } = require("../utils/error");
const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  const [user, metadata] = await sequelize.query("SELECT * FROM user");
  return res.json(user);
};

exports.getUserById = async (req, res) => {
  // Grab the user id and place in local variable
  const userId = req.params.userId;

  // Get the user from the database (NOTE: excluding password)
  const [user, metadata] = await sequelize.query(
    "SELECT id, email FROM user WHERE id = $userId",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!user) throw new NotFoundError("That user does not exist");

  // Send back user info
  return res.json(user);
};

exports.deleteUserById = async (req, res) => {
  // Grab the user id and place in local variable
  const userId = req.params.userId;

  // Check if user is admin || user is requesting to delete themselves
  if (userId != req.user?.userId && req.user.role !== userRoles.admin) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  // Delete the user from the database
  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!results || !results[0])
    throw new NotFoundError("That user does not exist");

  await sequelize.query("DELETE FROM user WHERE userId = $userId", {
    bind: { userId },
  });

  // Send back user info
  return res.sendStatus(204);
};
