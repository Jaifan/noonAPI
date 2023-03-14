const CustomError = require("../Errors/customError");
const vendor = require("../Models/vendor");

const createUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password)
      throw new CustomError("Please fill all the fields", 404);
    //let isVendorExists = await vendor.findOne({ name }).lean();
    //if (isVendorExists) throw new CustomError("Name already taken.!");
    if (password.length < 6)
      throw new CustomError("Password should be more than 5 characters.!");
    const checkVendor = await vendor.findOne({ name }).lean();
    if (checkVendor) throw new CustomError("Vendor already exists", 404);
    //excute command
    let response = await vendor.create({
      name,
      password,
    });
    if (response) {
      let token = response.createJWT();
      res.status(200).json({ Message: response, webTokenForVendor: token });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const getAllVendors = async (req, res) => {
  try {
    let response = await vendor.find().lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const getSingleVendors = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) throw new CustomError("Please provide id", 404);
    let response = await vendor.findById(id).lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const deleteVendorByID = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) throw new CustomError("Please provide id", 404);
    let response = await vendor.findByIdAndDelete(id).lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const vendorLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password)
      throw new CustomError("Please enter email and password.!", 404);
    let checkMail = await vendor.findOne({ name });
    if (!checkMail) throw new CustomError("Email not found.!", 404);
    let validUser = await checkMail.passwordCompare(password);
    if (!validUser) throw new CustomError("Invalid User.!", 404);

    //generate JWT Token
    let token = checkMail.createJWT();
    res
      .status(200)
      .json({ Message: "Login Successfull. as Vendor!", webToken: token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

module.exports = {
  createUser,
  getSingleVendors,
  getAllVendors,
  deleteVendorByID,
  vendorLogin,
};
