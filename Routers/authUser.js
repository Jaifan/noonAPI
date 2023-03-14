const {
  getAllUsers,
  getSingleUsers,
  deleteUserByID,
} = require("../Controllers/user");

const {
  addProductToCart,
  removeProductFromCart,
  emptyCart,
} = require("../Controllers/cart");

const express = require("express");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getSingleUsers).delete(deleteUserByID); //Lock
router.route("/cart").patch(emptyCart); //Lock
router
  .route("/cart/:productid")
  .patch(addProductToCart)
  .delete(removeProductFromCart); //lock

module.exports = router;
