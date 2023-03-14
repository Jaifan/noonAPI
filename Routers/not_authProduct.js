const {
  getAllProducts,
  getSingleProduct,
  searchProducts,
} = require("../Controllers/product");

const express = require("express");
const router = express.Router();

router.route("/").get(getAllProducts);
router.route("/search").get(searchProducts);
router.route("/:id").get(getSingleProduct);

module.exports = router;
