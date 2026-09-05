const express = require("express");

const router = express.Router();

const {
  createReview,
  getSellerReviews,
  getListingReviews,
} = require("../controllers/reviewController");

const auth = require("../middleware/auth.middleware");

router.post("/", auth, createReview);

router.get("/:id", getSellerReviews);

router.get("/listing/:id", getListingReviews);

module.exports = router;