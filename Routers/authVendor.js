const { deleteVendorByID } = require("../Controllers/vendor");

const express = require("express");
const router = express.Router();

router.route("/:id").delete(deleteVendorByID).patch();

module.exports = router;
