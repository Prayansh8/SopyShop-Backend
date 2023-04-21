const express = require("express");
const cloudinary = require("cloudinary");
const { signUp, signIn } = require("./controllers/user");
const bodyParser = require("body-parser");
const {
  getUsers,
  getUser,
  getUserDetails,
  logoutUser,
  forwordPassword,
  resetPassword,
  updatePassword,
  updateUserRole,
  deleteUser,
} = require("./controllers/userAuth");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  createProductReviwe,
  getAllProductsReviews,
  deleteReviewes,
} = require("./controllers/product");
const cookieParser = require("cookie-parser");
const { isAuthenticatedUser, autherizeRoles } = require("./middlewere/auth");
const {
  newOrder,
  myOrders,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("./controllers/order");

// middlewere for error

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { config } = require("./config");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

cloudinary.config({
  cloud_name: config.cloudinaryName,
  api_key: config.cloudinaryKey,
  api_secret: config.cloudinarySecret,
});

const userRouter = express.Router();
userRouter.post("/register", signUp);
userRouter.post("/get-token", signIn);

const userAuthRouter = express.Router();
userAuthRouter.get("/me", isAuthenticatedUser, getUserDetails);
userAuthRouter.get("/logout", isAuthenticatedUser, logoutUser);
userAuthRouter.get("/users", isAuthenticatedUser, getUsers);
userAuthRouter.get("/user/:id", isAuthenticatedUser, getUser);
userAuthRouter.post("/reset/password", isAuthenticatedUser, forwordPassword);
userAuthRouter.put(
  "/reset/password/:token",
  isAuthenticatedUser,
  resetPassword
);
userAuthRouter.put("/password/update", isAuthenticatedUser, updatePassword);
userAuthRouter.patch(
  "/admin/update",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  updateUserRole
);
userAuthRouter.delete(
  "/admin/delete-user",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  deleteUser
);

const productRouter = express.Router();
productRouter.post(
  "/product/new",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  createProduct
);
productRouter.get("/product/:id", getProduct);
productRouter.get("/products", getAllProducts);
productRouter.patch(
  "/product/update/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  updateProduct
);
productRouter.delete(
  "/product/delete/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  deleteProduct
);
productRouter.put("/product/review", isAuthenticatedUser, createProductReviwe);
productRouter.get("/reviews", getAllProductsReviews);
productRouter.delete("/delete/review", isAuthenticatedUser, deleteReviewes);

const orderRouter = express.Router();
orderRouter.post("/order/new", isAuthenticatedUser, newOrder);
orderRouter.get(
  "/order/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  getSingleOrder
);
orderRouter.get("/my-orders", isAuthenticatedUser, myOrders);
orderRouter.get(
  "/admin/orders",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  getAllOrders
);
orderRouter.put(
  "/admin/order/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  updateOrder
);
orderRouter.delete(
  "/admin/order/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  deleteOrder
);

app.use("/api/v1", userRouter);
app.use("/api/v1", userAuthRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", orderRouter);

app.listen(config.port, () =>
  console.log(`Example app listening on port ${config.baseUrl}:${config.port}`)
);
