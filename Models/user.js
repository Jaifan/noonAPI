require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter user name"],
      maxlength: [100, "User name cannot exceed 100 characters"],
      minlength: [5, "User name cannot be less than 5 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      minlength: 6,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    cartItems: [
      {
        productItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    cartPrice: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "user",
      required: [true, "Please provide a type"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(11);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      type: this.type,
    },
    "MbQeThWmZq4t7w!z%C*F-JaNdRfUjXn2r5u8x/A?D(G+KbPeShVkYp3s6v9y$B&E",
    {
      expiresIn: "48h",
    }
  );
  return token;
};
userSchema.methods.passwordCompare = async function (comparePassword) {
  const IsMatch = await bcrypt.compare(comparePassword, this.password);
  return IsMatch;
};

userSchema.methods.addToCart = async function (productId) {
  this.cartItems.push(productId);
};

userSchema.methods.removeFromCart = async function (productId) {
  this.cartItems = this.cartItems.filter((item) => item != productId);
};

module.exports = mongoose.model("user", userSchema);
