const ApiFeatures = require("../utills/ApiFeatures");
const { db } = require("../databases/index");
const catchAsyncErrors = require("../middlewere/catchAsyncErrors");
const { uploadImage, s3 } = require("../uploder/upload");
const { config } = require("../config");

// create product
const createProduct = async (req, res, next) => {
  req.body.user = req.user.user._id;
  let user = req.body.user;
  const { name, description, price, category, stock } = req.body;

  const uploadImages = Promise.all(
    req.files.map(async (file) => {
      const params = {
        Bucket: config.aws.awsBucketName,
        Key: new Date().toISOString() + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const result = await s3.upload(params).promise();
      return result.Location;
    })
  );

  const images = (await uploadImages).map((url) => ({ url }));

  const productDetails = new db.product({
    name,
    description,
    price,
    images,
    stock,
    category,
    user,
  });

  try {
    const product = await db.product.create(productDetails);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// get product
const getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await db.product.findById(req.params.id);

  if (!product) {
    return res
      .status(500)
      .send({ success: false, massage: "Product not found" });
  }

  return res.status(200).send({ success: true, product });
});

// get all products
const getAllProducts = catchAsyncErrors(async (req, res) => {
  try {
    const resultPerPage = 8;
    const productsCount = await db.product.countDocuments();
    const features = new ApiFeatures(db.product.find(), req.query)
      .filter()
      .search()
      .category()
      .price()
      .paginate(resultPerPage);

    const products = await features.query;
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      results: products.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

// get admin products
const getAdminProducts = async (req, res) => {
  try {
    const products = await db.product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

// update product
const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const { name, description, price, category, stock } = req.body;

  const productData = {
    name,
    description,
    price,
    category,
    stock,
  };
  try {
    product = await db.product.findByIdAndUpdate(productId, productData, {
      new: true,
    });
    const productDetails = await db.product.findById(productId);
    return res.status(200).send({ success: true, productDetails });
  } catch (error) {
    return res.status(400).send({ success: false });
  }
};

// Delete Product
const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const product = await db.product.findById(productId);

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
  const product = await db.product.findById(req.query.id);

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
  getAdminProducts,
  updateProduct,
  deleteProduct,
  createProductReviwe,
  getAllProductsReviews,
  deleteReviewes,
};
