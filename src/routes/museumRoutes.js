const express = require("express");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");
const router = express.Router();
const {
  getAllMuseums,
  getMuseumById,
  createNewMuseum,
  updateMuseumById,
  deleteMuseumById,
} = require("../controllers/museumControllers");
const { userRoles } = require("../constants/users");

router.get("/museums", isAuthenticated, getAllMuseums);
router.get("/museums/:museumId", isAuthenticated, getMuseumById);
router.post(
  "/museums",
  isAuthenticated,
  authorizeRoles(userRoles.admin || userRoles.owner),
  createNewMuseum
);
router.put(
  "/museums/:museumId",
  isAuthenticated,
  authorizeRoles(userRoles.admin || userRoles.owner),
  updateMuseumById
);
router.delete(
  "/museum/:museumId",
  isAuthenticated,
  authorizeRoles(userRoles.admin || userRoles.owner),
  deleteMuseumById
);

module.exports = router;
