const express = require("express");
const { signUp, signIn } = require("./controllers/user");
const { getUsers, getUser } = require("./controllers/auth");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("./controllers/product");
const cors = require("cors");

// middlewere for error

const dotenv = require("dotenv");
dotenv.config();
const { config } = require("./config");

const app = express();
app.use(cors());
app.use(express.json());

const authRouter = express.Router();
authRouter.post("/new", signUp);
authRouter.post("/get-token", signIn);
authRouter.get("/users", getUsers);
authRouter.get("/user/:id", getUser);

const productRouter = express.Router();
productRouter.post("/product/new", createProduct);
productRouter.get("/product/:id", getProduct);
productRouter.get("/products", getAllProducts);
productRouter.put("/product/update/:id", updateProduct);
productRouter.delete("/product/delete/:id", deleteProduct);

app.use("/api/v1", authRouter);
app.use("/api/v1", productRouter);

app.listen(config.port, () =>
  console.log(`Example app listening on port ${config.baseUrl}:${config.port}`)
);
