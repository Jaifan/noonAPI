const CustomError = require("../Errors/customError");
const user = require("../Models/user");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (req.user) throw new CustomError("You are already Login", 404);
    if (!name || !email || !password)
      throw new CustomError("Please fill all the fields", 404);
    let isMailExists = await user.findOne({ email }).lean();
    if (isMailExists) throw new CustomError("Email already taken.!");
    if (password.length < 6)
      throw new CustomError("Password should be more than 5 characters.!");

    //excute command
    let response = await user.create({
      name,
      email,
      password,
    });
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let response = await user.find().lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const getSingleUsers = async (req, res) => {
  try {
    let id = req.params.id;
    let _id = req.user._id;
    if (!id) throw new CustomError("Please provide id", 404);
    if (id != _id)
      throw new CustomError("Your are not this account owner", 404);
    let response = await user.findById(id).lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const deleteUserByID = async (req, res) => {
  try {
    let id = req.params.id;
    let _id = req.user._id;
    if (!id) throw new CustomError("Please provide id", 404);
    if (id != _id)
      throw new CustomError("Your are not this account owner", 404);
    let response = await user.findByIdAndDelete(id).lean();
    res.status(200).json({ Message: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new CustomError("Please enter email and password.!", 404);
    let checkMail = await user.findOne({ email });
    if (!checkMail) throw new CustomError("Email not found.!", 404);
    let validUser = await checkMail.passwordCompare(password);
    if (!validUser) throw new CustomError("Invalid User.!", 404);

    //generate JWT Token
    let token = checkMail.createJWT();
    res.status(200).json({ Message: "Login Successfull.!", webToken: token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Message: err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUsers,
  deleteUserByID,
  userLogin,
};
