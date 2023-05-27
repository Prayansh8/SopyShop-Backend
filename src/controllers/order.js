const { db } = require("../databases/index");

const newOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const orderData = {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user.user._id,
    };

    const order = await db.order(orderData);
    order.save();

    return res.status(200).send({ success: true, order });
  } catch (error) {
    return res.status(400).send({ success: false, message: error });
  }
};

const getSingleOrder = async (req, res, next) => {
  try {
    const order = await db.order
      .findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).send("Order not found");
    }
    return res.status(200).send({ success: true, order });
  } catch (error) {
    console.error(`Failed to get post, error: ${error.message}`);
  }
};

const myOrders = async (req, res, next) => {
  const user = req.user.user._id;
  try {
    const orders = await db.order.find({ user: user });
    if (!orders) {
      return res.status(404).send("orders not found");
    }
    return res.status(200).send({ success: true, orders });
  } catch (error) {
    console.error(`Failed to get post, error: ${error.message}`);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await db.order.find();
    if (!orders) {
      return res.status(404).send("orders not found");
    }
    var totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
    return res.status(200).send({ success: true, totalAmount, orders });
  } catch (error) {
    console.error(`Failed to get post, error: ${error.message}`);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await db.order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("orders not found");
    }
    if (order.orderStatus === "Delivered") {
      return res.status(404).send("you have deliverder this product");
    }
    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    return res.status(200).send({ success: true, order });
  } catch (error) {
    console.error(`Failed to get post, error: ${error.message}`);
  }
};

const updateStock = async (id, quantity) => {
  const product = await db.product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await db.order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("orders not found");
    }
    await order.remove();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(`Failed to get post, error: ${error.message}`);
  }
};

module.exports = {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
