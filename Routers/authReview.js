const {
  createReview,
  deleteReviewByID,
  getAllReview,
} = require("../Controllers/review");

const express = require("express");
const router = express.Router();

router.route("/create/:id").post(createReview);
router.route("/").get(getAllReview);
router.route("/:id").delete(deleteReviewByID).patch();

module.exports = router;
