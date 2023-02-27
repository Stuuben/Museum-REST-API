const express = require("express");
const { userRoles } = require("../constants/users");
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");
const router = express.Router();

router.get("/", isAuthenticated, authorizeRoles(userRoles.ADMIN), getAllUsers);
router.get("/:userId", isAuthenticated, getUserById);
router.delete("/:userId", isAuthenticated, deleteUser);

module.exports = router;
