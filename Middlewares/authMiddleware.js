require("dotenv").config();
const jwt = require("jsonwebtoken");
const CustomError = require("../Errors/customError");

const authMiddleware = (req, res, next) => {
  try {
    console.log("Middleware");
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization.startsWith("Bearer ") || !authorization)
      throw new CustomError("User is not Authenticated.! ", 404);
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(
      token,
      "MbQeThWmZq4t7w!z%C*F-JaNdRfUjXn2r5u8x/A?D(G+KbPeShVkYp3s6v9y$B&E"
    );
    req.user = {
      _id: payload._id,
      type: payload.type,
      name: payload.name,
    };
    console.log(`Middleware info ${req.user}`);
    next();
  } catch (error) {
    throw new CustomError(
      "User is not Authenticated. Please Check the Header! ",
      404
    );
  }
};

module.exports = authMiddleware;
