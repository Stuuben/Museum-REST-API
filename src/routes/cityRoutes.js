const express = require("express");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");
const router = express.Router();

const {
  getAllCities,
  getCityById,
  createNewCity,
} = require("../controllers/cityController");
const { userRoles } = require("../constants/users");

router.get("/cities", isAuthenticated, getAllCities);
router.get("/cities/:cityId", isAuthenticated, getCityById);

router.post(
  "/cities/",
  isAuthenticated,
  authorizeRoles(userRoles.admin || userRoles.owner),
  createNewCity
);

module.exports = router;
