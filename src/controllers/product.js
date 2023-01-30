const ApiFetures = require("../utills/apifeture");
const { db } = require("../databases/index");
const catchAsyncErrors = require("../middlewere/catchAsyncErrors");

// create product
const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.user._id;
  const product = await db.product.create(req.body);
  return res.status(200).send({ success: true, product });
});

// get product
const getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await db.product.findById(req.params.id);

  if (!product) {
    return res
      .status(500)
      .send({ success: true, massage: "Product not found" });
  }

  return res.status(200).send({ success: true, product });
});

// get all products
const getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await db.product.countDocuments();
  const apiFeture = new ApiFetures(db.product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const product = await apiFeture.query;
  return res.status(200).send({ success: true, product, productCount });
});

// update product
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params._id;
  const productData = req.body;
  let product = null;
  try {
    product = await db.product.findById(productId);
  } catch (error) {
    console.error(`Failed to get post, error: ${error.message}`);
  }

  await db.product.updateOne(product, productData);
  product = await db.product.findById(productId);
  return res.send({ success: true, product });
});

// Delete Product
const deleteProduct = async (req, res, next) => {
  const product = await db.product.findById(req.params.id);

  if (!product) {
    return res
      .status(500)
      .send({ success: true, massage: "Product not found" });
  }

  await product.remove();

  return res
    .status(200)
    .send({ success: true, massage: "Product Deleted Successfull" });
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
