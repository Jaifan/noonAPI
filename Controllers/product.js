const CustomError = require("../Errors/customError");
const product = require("../Models/product");
const vendor = require("../Models/vendor");

const createProduct = async (req, res) => {
  try {
    const { _id, type, name: VendorName } = req.user;
    if (!_id) throw new CustomError("Please Login", 404);
    if (type != "vendor") throw new CustomError("You are not vendor", 404);
    const { name, overview, price, imgSourceUrl, quantity, category } =
      req.body;
    if (
      !name ||
      !overview ||
      !price ||
      !imgSourceUrl ||
      !quantity ||
      !category
    ) {
      throw new CustomError("Please enter all fields", 400);
    }
    const response = await product.create({
      name,
      createBy: _id,
      overview,
      price,
      imgSourceUrl,
      quantity,
      category,
    });
    const vendorResponse = await vendor.findOneAndUpdate(
      { _id },
      {
        $push: { product: response._id },
      },
      { new: true }
    );

    res.status(201).json({
      Message: "Product created successfully & added to vendor as well",
      product: response,
      vendor: vendorResponse,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let response = await product.find().lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) throw new CustomError("Please provide id", 404);
    let response = await product.findById(id).lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const deleteProductByID = async (req, res) => {
  try {
    let response;
    const { _id, type, name: VendorName } = req.user;
    let id = req.params.id;
    if (!_id) throw new CustomError("Please Login", 404);
    if (type != "vendor") throw new CustomError("You are not vendor", 404);
    if (!id) throw new CustomError("Please product provide id", 404);
    response = await product.findById(id).lean();
    if (!response) throw new CustomError("Product not found", 404);
    if (response.createBy != _id)
      throw new CustomError("You are not owner of this product", 404);
    const vendorResponse = await vendor.findOneAndUpdate(
      { _id },
      { $pull: { product: id } },
      { new: true }
    );
    response = await product.findByIdAndDelete(id).lean();
    res.status(200).json({ Message: response, vendor: vendorResponse });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { name, category } = req.query;
    const objectQuery = {};
    if (name) objectQuery.name = { $regex: name, $options: "i" };
    if (category) objectQuery.category = category;
    //if (category != undefined) objectQuery.category = category;
    const response = await product.find(objectQuery).lean();
    res.status(200).json({ Message: response });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProductByID,
  searchProducts,
};
