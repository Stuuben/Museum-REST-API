const express = require("express");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");
const router = express.Router();
const {
  getAllReviews,
  getReviewsByUserId,
  getReviewsByMuseum,
  createNewReview,
  deleteReviewById,
} = require("../controllers/reviewControllers");
const { userRoles } = require("../constants/users");

router.get("/reviews", isAuthenticated, getAllReviews);
router.get("/reviews/user/:userId", isAuthenticated, getReviewsByUserId);
router.get("/reviews/museum/:museumId", isAuthenticated, getReviewsByMuseum);
router.post("/reviews", isAuthenticated, createNewReview);
router.delete("/reviews/:reviewId", isAuthenticated, deleteReviewById);

module.exports = router;
