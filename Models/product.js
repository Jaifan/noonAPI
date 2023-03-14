const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      maxlength: [300, "Product name cannot exceed 100 characters"],
      minlength: [5, "Product name cannot be less than 5 characters"],
      trim: true,
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
      required: [true, "Please enter product vendor"],
    },
    overview: {
      type: String,
      required: [true, "Please enter product overview"],
      minlength: [10, "Product overview cannot be less than 10 characters"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      minimum: [5, "Product price cannot be less than 5"],
    },
    imgSourceUrl: [
      {
        type: String,
        required: [true, "Please enter product image source url"],
        trim: true,
      },
    ],
    quantity: {
      type: Number,
      required: [true, "Please enter product quantity"],
    },
    category: {
      type: String,
      enum: ["Gadgets", "Clothes", "Shoes", "Accessories", "Others"],
      required: [true, "Please enter product category"],
      default: "Others",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
