const { getReviewByID } = require("../Controllers/review");

const express = require("express");
const router = express.Router();

router.route("/:id").get(getReviewByID);

module.exports = router;
