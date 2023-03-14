const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Please enter user id"],
    },
    reviewFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: [true, "Please enter product id"],
    },
    description: {
      type: String,
      required: [true, "Please enter review description"],
      minlength: [3, "Review description cannot be less than 10 characters"],
      trim: true,
      maxlegtth: [200, "Review description cannot exceed 200 characters"],
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, "Please enter review rating"],
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
