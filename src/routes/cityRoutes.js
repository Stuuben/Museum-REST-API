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
  deleteCityById,
} = require("../controllers/cityController");
const { userRoles } = require("../constants/users");

router.get("/cities", isAuthenticated, getAllCities);
router.get("/cities/:cityId", isAuthenticated, getCityById);
router.delete(
  "/cities/:cityId",
  isAuthenticated,
  authorizeRoles(userRoles.admin),
  deleteCityById
);
router.post(
  "/cities/",
  isAuthenticated,
  authorizeRoles(userRoles.admin),
  createNewCity
);

module.exports = router;
