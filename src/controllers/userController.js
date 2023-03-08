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
  const userId = req.params.userId;

  const [review, reviewMeta] = await sequelize.query(
    `
        SELECT * FROM review
        WHERE review.fk_user_id = $userId  
        `,
    {
      bind: { userId: userId },
      type: QueryTypes.SELECT,
    }
  );
  if (
    req.user.role == userRoles.admin ||
    req.user.userId == review.fk_user_id
  ) {
    await sequelize.query(
      `
              DELETE FROM review
              WHERE review.fk_user_id = $userId 
              `,
      {
        bind: {
          userId: userId,
        },
        types: QueryTypes.DELETE,
      }
    );
  }
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
  if (
    req.user.role == userRoles.admin ||
    req.user.userId == review.fk_user_id
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
    throw new UnauthorizedError("You are not allowed to perform this action");
  }
};
