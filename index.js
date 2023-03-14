const dbConnect = require("./Database/db");
const user_auth = require("./Routers/authUser");
const user_not_auth = require("./Routers/not_authUser");
const product_auth = require("./Routers/authProduct");
const product_not_auth = require("./Routers/not_authProduct");
const vendor_auth = require("./Routers/authVendor");
const vendor_not_auth = require("./Routers/not_authVendor");
const review_auth = require("./Routers/authReview");
const review_not_auth = require("./Routers/not_authReview");
const errorHandleMiddleware = require("./Middlewares/errorHandle");
const notFound = require("./Middlewares/notFound");
const authMiddleware = require("./Middlewares/authMiddleware");

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

//App Middlewares
app.use(express.json());

//Security Middlewares
app.use(cors());
app.use(helmet());
app.use(xssClean());
app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 500 })); //15 minutes 100 requests per IP address

app.get("/", (req, res) => {
  res.send("Noon API as Demo System Architecture");
});
//App Routes

const baseURl = "/api";

//auth Middleware used to check if user/Vendor is logged in or not
app.use(`${baseURl}/user/auth`, authMiddleware, user_auth);
app.use(`${baseURl}/product/auth`, authMiddleware, product_auth);
app.use(`${baseURl}/review/auth`, authMiddleware, review_auth);
app.use(`${baseURl}/vendor/auth`, authMiddleware, vendor_auth);

app.use(`${baseURl}/user`, user_not_auth);
app.use(`${baseURl}/product`, product_not_auth);
app.use(`${baseURl}/review`, review_not_auth);
app.use(`${baseURl}/vendor/`, vendor_not_auth);

//Error handler
app.use(notFound);
app.use(errorHandleMiddleware);

//DataBase Connection
dbConnect();

//System Initialization
const start = () => {
  const PORT = process.env.PORT || 6000;
  app.listen(PORT, console.log(`Server is listening on port ${PORT}...`));
};
try {
  start();
} catch (error) {
  console.log(error);
}
