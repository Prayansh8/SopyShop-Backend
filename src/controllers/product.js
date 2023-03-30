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

const createProductReviwe = async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.user._id,
    name: req.user.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await db.product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  return res.status(200).send({ success: true, data: product });
};

const getAllProductsReviews = async (req, res, next) => {
  const product = await db.product.findById(req.query.productId);

  if (!product) {
    return res.status(400).send({ massage: "Product not found" });
  }

  return res.status(200).send({ success: true, massage: product.reviews });
};

const deleteReviewes = async (req, res, next) => {
  const product = await db.product.findById(req.query.productId);

  if (!product) {
    return res.status(400).send({ massage: "Product not found" });
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / product.reviews.length;

  const numOfReviews = reviews.length;

  await db.product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  return res.status(200).send({ success: true, massage: product.reviews });
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  createProductReviwe,
  getAllProductsReviews,
  deleteReviewes,
};
