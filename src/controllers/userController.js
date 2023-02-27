const User = require("../models/User");
const { notFoundError } = require("../utils/error");

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  return res.json(users);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user) throw new notFoundError("User does not expist pucko!");

  return res.json(user);
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user) throw new notFoundError("FIIIINS INTE");

  await user.delete();

  return res.sendStatus(204);
};
