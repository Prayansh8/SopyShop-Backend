const mongoose = require("mongoose");
const moment = require("moment");

const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: [true, "Please Enter the Preoduct Name"] },
  description: {
    type: String,
    required: [true, "Please Enter the Preoduct Discription"],
  },
  price: {
    type: Number,
    maxLength: [8, "Price cannot exceed 8 characters"],
    required: [true, "Please Enter the Preoduct Price"],
  },
  rating: { type: Number, default: 0 },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Plese enter product ceregory"],
  },
  stock: {
    type: Number,
    required: [true, "Plese enter product ceregory"],
    maxLength: 5,
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
      },
      rating: {
        type: String,
      },
      comment: {
        type: String,
      },
    },
  ],
  createdAt: { type: Date, default: moment.utc().toISOString() },
  updatedAt: { type: Date, default: moment.utc().toISOString() },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
