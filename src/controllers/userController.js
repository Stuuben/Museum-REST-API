const { NotFoundError, UnauthorizedError } = require("../utils/error");
const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  const [user, metadata] = await sequelize.query("SELECT * FROM user");
  return res.json(user);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  const [user, metadata] = await sequelize.query(
    "SELECT * FROM user WHERE id = $userId",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  if (!user) throw new NotFoundError("That user does not exist");
  return res.json(user);
};

exports.deleteUserById = async (req, res) => {
  //KEY CONTRAINTS FAILED NÄR VI FÖRSÖKER RADERA. FRÅGA PETTER OM DENNA!
  const userId = req.params.userId;

  const [user, userMeta] = await sequelize.query(
    `
        SELECT * FROM user
        WHERE user.id = $userId  
        `,
    {
      bind: { userId: userId },
      type: QueryTypes.SELECT,
    }
  );

  if (!user) {
    throw new NotFoundError("This user does not exist.");
  }

  if (
    req.user.role == userRoles.admin ||
    req.user.role == userRoles.owner ||
    req.review.fk_user_id == userId
  ) {
    await sequelize.query(
      `
              DELETE FROM user
              WHERE user.id = $userId
              `,
      {
        bind: {
          userId: userId,
        },
        types: QueryTypes.DELETE,
      }
    );
    return res.sendStatus(204);
  } else {
    throw new UnauthorizedError(
      "You do not have permission to delete this user"
    );
  }
};

/*
exports.deleteUserById = async (req, res) => {
  const userId = req.params.userId;
  if (userId != req.user?.userId && req.user.role !== userRoles.admin) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  if (!results || !results[0])
    throw new NotFoundError("That user does not exist");

  await sequelize.query("DELETE FROM user WHERE userId = $userId", {
    bind: { userId },
  });

  return res.sendStatus(204);
};

*/
