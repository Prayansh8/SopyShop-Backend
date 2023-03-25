const express = require("express");
const { signUp, signIn } = require("./controllers/user");
const {
  getUsers,
  getUser,
  logoutUser,
  forwordPassword,
} = require("./controllers/userAuth");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
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
userAuthRouter.get("/logout", logoutUser);
userAuthRouter.get("/users", getUsers);
userAuthRouter.get("/user/:id", getUser);
userAuthRouter.post("/reset/password", forwordPassword);

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

app.use("/api/v1", userRouter);
app.use("/api/v1", userAuthRouter);
app.use("/api/v1", productRouter);

app.listen(config.port, () =>
  console.log(`Example app listening on port ${config.baseUrl}:${config.port}`)
);
