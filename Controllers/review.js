const CustomError = require("../Errors/customError");
const review = require("../Models/review");
const product = require("../Models/product");

const createReview = async (req, res) => {
  try {
    const { _id, type } = req.user;
    const reviewFor = req.params.id;
    const { description, rating } = req.body;
    if (type != "user") throw new CustomError("You are not user", 404);
    if (!_id || !reviewFor || !description || !rating)
      throw new CustomError("Please enter all fields", 400);

    const response = await review.create({
      reviewBy: _id,
      reviewFor,
      description,
      rating,
    });

    const productResponse = await product.findByIdAndUpdate(
      { _id: reviewFor },
      { $push: { reviews: response._id } },
      { new: true }
    );

    res.status(201).json({
      Message: "Review created successfully and Added the Review to Product",
      Review: response,
      product: productResponse,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const getReviewByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new CustomError("Please provide id", 404);
    const response = await review.findById(id).lean();
    res.status(200).json({ Message: "Review fetched successfully", response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const getAllReview = async (req, res) => {
  try {
    const response = await review.find().lean();
    res.status(200).json({ Message: "Review fetched successfully", response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const deleteReviewByID = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) throw new CustomError("Please provide id", 404);

    const { _id, type } = req.user;
    if (type != "user") throw new CustomError("You are not user", 404);
    let response = await review.findById(id).lean();
    if (!response) throw new CustomError("Review not found", 404);
    let productResponse = await product.findOne(response.reviewFor).lean();

    if (_id != response.reviewBy)
      throw new CustomError("You are not the owner of this review", 404);
    productResponse = await product.findOneAndUpdate(
      { _id: productResponse },
      { $pull: { reviews: response._id } },
      { new: true }
    );
    response = await review.findByIdAndDelete(id).lean();

    res.status(200).json({ Message: response, product: productResponse });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

module.exports = {
  createReview,
  getReviewByID,
  deleteReviewByID,
  getAllReview,
};
