const express = require("express");
const { userRoles } = require("../constants/users");
const {
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/userController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");
const router = express.Router();

router.get(
  "/users",
  isAuthenticated,
  authorizeRoles(userRoles.admin),
  getAllUsers
);
router.get(
  "/users/:userId",
  isAuthenticated,
  authorizeRoles(userRoles.admin),
  getUserById
);
router.delete(
  "/users/:userId",
  isAuthenticated,
  // authorizeRoles(userRoles.admin),
  deleteUserById
);

module.exports = router;
