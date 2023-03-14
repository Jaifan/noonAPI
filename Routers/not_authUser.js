const { createUser, userLogin } = require("../Controllers/user");

const express = require("express");
const router = express.Router();

router.route("/create").post(createUser);
router.route("/login").post(userLogin);

module.exports = router;
