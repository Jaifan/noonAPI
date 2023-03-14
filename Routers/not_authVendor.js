const {
  createUser,
  getAllVendors,
  getSingleVendors,
  vendorLogin,
} = require("../Controllers/vendor");

const express = require("express");
const router = express.Router();

router.route("/create").post(createUser);
router.route("/").get(getAllVendors);
router.route("/:id").get(getSingleVendors);
router.route("/login").post(vendorLogin);

module.exports = router;
