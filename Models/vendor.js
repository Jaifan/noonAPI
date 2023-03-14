require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter vendor name"],
      minlegth: [5, "Vendor name cannot be less than 5 characters"],
      maxlength: [100, "Vendor name cannot exceed 100 characters"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    type: {
      type: String,
      default: "vendor",
      required: [true, "Please provide a type"],
    },
  },
  { timestamps: true }
);

vendorSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(11);
  this.password = await bcrypt.hash(this.password, salt);
});

vendorSchema.methods.createJWT = function () {
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
vendorSchema.methods.passwordCompare = async function (comparePassword) {
  const IsMatch = await bcrypt.compare(comparePassword, this.password);
  return IsMatch;
};

module.exports = mongoose.model("vendor", vendorSchema);
