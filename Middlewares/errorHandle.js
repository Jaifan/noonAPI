function errorHandler(err, req, res, next) {
  console.error("Unhandled exception caught:", err);
  res
    .status(500)
    .send({ Message: "Internal Server Error, You may Need Login" });
}

module.exports = errorHandler;
