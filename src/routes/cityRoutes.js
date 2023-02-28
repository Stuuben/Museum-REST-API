const express = require("express");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const router = express.Router();

const { getAllCities } = require("../controllers/cityController");

router.get("/", isAuthenticated, getAllCities);
//router.get("/cities/:cityId", isAuthenticated, getCityById);
//router.delete("/cities/:cityId", isAuthenticated, deleteCityById);
//router.post("/cities/", isAuthenticated, createNewCity);

module.exports = router;
