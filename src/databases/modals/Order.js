const mongoose = require("mongoose");
const moment = require("moment");

const { Schema } = mongoose;

const OrderSchema = new Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Plese Enter Your address"],
    },
    city: {
      type: String,
      required: [true, "Plese Enter Your city"],
    },
    state: {
      type: String,
      required: [true, "Plese Enter Your state"],
    },
    pinCode: {
      type: Number,
      required: [true, "Plese Enter Your pinCode"],
    },
    phone: {
      type: Number,
      required: [true, "Plese Enter Your phone"],
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: [true, "Plese Enter Your name"],
      },
      price: {
        type: Number,
        required: [true, "Plese Enter Your price"],
      },
      quantity: {
        type: Number,
        required: [true, "Plese Enter Your quantity"],
      },
      image: {
        type: String,
        required: [true, "Plese Enter Your image"],
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: [true, "Plese Enter Your city"],
    },
    status: {
      type: String,
      required: [true, "Plese Enter Your city"],
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: moment.utc().toISOString() },
  updatedAt: { type: Date, default: moment.utc().toISOString() },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
