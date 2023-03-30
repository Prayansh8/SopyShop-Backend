const express = require("express");
const { signUp, signIn } = require("./controllers/user");
const {
  getUsers,
  getUser,
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
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { isAuthenticatedUser, autherizeRoles } = require("./middlewere/auth");

// middlewere for error

const dotenv = require("dotenv");
dotenv.config();
const { config } = require("./config");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const userRouter = express.Router();
userRouter.post("/new", signUp);
userRouter.post("/get-token", signIn);

const userAuthRouter = express.Router();
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
userAuthRouter.put(
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
productRouter.get("/products", isAuthenticatedUser, getAllProducts);
productRouter.put(
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
productRouter.get("/product/reviews", getAllProductsReviews);
productRouter.get(
  "/product/delete/reviews",
  isAuthenticatedUser,
  deleteReviewes
);

app.use("/api/v1", userRouter);
app.use("/api/v1", userAuthRouter);
app.use("/api/v1", productRouter);

app.listen(config.port, () =>
  console.log(`Example app listening on port ${config.baseUrl}:${config.port}`)
);
