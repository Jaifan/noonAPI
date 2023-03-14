const user = require("../Models/user");
const product = require("../Models/product");
const CustomError = require("../Errors/customError");

const addProductToCart = async (req, res) => {
  try {
    if (!req.user) throw new CustomError("Please login", 401);
    const { _id, type } = req.user;
    const { productid } = req.params;
    if (!_id || !productid)
      throw new CustomError("Please provide id and product", 404);
    let productOBJ = await product.findById(productid).lean();
    if (!productOBJ) throw new CustomError("Product not found", 404);
    let userOBJ = await user.findById(_id).lean();
    if (!userOBJ) throw new CustomError("User not found", 404);

    const isProductInCart = userOBJ.cartItems.find(
      (item) => item.productItem == productid
    );
    if (isProductInCart) {
      let response = await user
        .updateOne(
          { _id, "cartItems.productItem": productid },
          {
            $inc: { "cartItems.$.quantity": 1 },
          }
        )
        .lean();
      response = await user
        .findByIdAndUpdate(
          { _id },
          { $inc: { cartPrice: productOBJ.price } },
          { new: true }
        )
        .lean();
      return res.status(200).json({ Message: response });
    }

    let response = await user
      .findByIdAndUpdate(
        { _id },
        {
          $push: { cartItems: { productItem: productid } },
          cartPrice: userOBJ.cartPrice + productOBJ.price,
        },
        { new: true }
      )
      .lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    if (!req.user) throw new CustomError("Please login", 401);
    const { _id, type } = req.user;
    const { productid } = req.params;
    if (!_id || !productid)
      throw new CustomError("Please provide id and product", 404);
    let productOBJ = await product.findById(productid).lean();
    if (!productOBJ) throw new CustomError("Product not found", 404);
    let userOBJ = await user.findById(_id).lean();
    if (!userOBJ) throw new CustomError("User not found", 404);

    const isProductInCart = userOBJ.cartItems.find(
      (item) => item.productItem == productid
    );
    if (isProductInCart) {
      let response;
      if (isProductInCart.quantity <= 1) {
        response = await user
          .updateOne(
            { _id, "cartItems.productItem": productid },
            {
              $pull: { cartItems: { productItem: productid } },
            }
          )
          .lean();
      } else {
        response = await user
          .updateOne(
            { _id, "cartItems.productItem": productid },
            {
              $inc: { "cartItems.$.quantity": -1 },
            }
          )
          .lean();
      }
      response = await user
        .findByIdAndUpdate(
          { _id },
          { $inc: { cartPrice: -productOBJ.price } },
          { new: true }
        )
        .lean();
      return res.status(200).json({ Message: response });
    }

    let response = await user
      .findByIdAndUpdate(
        { _id },
        {
          $push: { cartItems: { productItem: productid } },
          cartPrice: userOBJ.cartPrice + productOBJ.price,
        },
        { new: true }
      )
      .lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const emptyCart = async (req, res) => {
  try {
    if (!req.user) throw new CustomError("Please login", 401);
    const { _id } = req.user;
    if (!_id) throw new CustomError("Please provide id", 404);
    const response = await user
      .findByIdAndUpdate(
        { _id },
        { cartItems: [], cartPrice: 0 },
        { new: true }
      )
      .lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

module.exports = {
  addProductToCart,
  removeProductFromCart,
  emptyCart,
};
