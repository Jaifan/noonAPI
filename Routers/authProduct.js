const { createProduct, deleteProductByID } = require("../Controllers/product");

const express = require("express");
const router = express.Router();

router.route("/create").post(createProduct); //lock
router.route("/:id").delete(deleteProductByID).patch(); //lock

module.exports = router;
