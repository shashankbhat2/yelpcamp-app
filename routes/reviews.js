const express = require("express");
const catchAsync = require("../utils/CatchAsync");
const { validateReview } = require("../utils/CampgroundValidate");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });
const {
  deleteReviewById,
  postNewReview,
} = require("../controllers/reviews.controller");

router.delete("/:reviewId", isReviewAuthor, catchAsync(deleteReviewById));

router.post("/", isLoggedIn, validateReview, catchAsync(postNewReview));

module.exports = router;
