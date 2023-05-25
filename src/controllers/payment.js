const { config } = require("../config");
const stripe = require("stripe")(config.stripe.stripeSecret);

const processPayment = async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount, // Amount in cents
      currency: "inr",
      payment_method_types: ["card"],
    });
    return res
      .status(200)
      .json({ success: true, clientSecret: paymentIntent.client_secret });

    // Use the paymentIntent.client_secret to complete the payment on the client-side
  } catch (error) {
    console.error("Error creating Payment Intent:", error);
    return res.status(200).json({ success: false });
  }
};

const sendStripeApiKey = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    stripeApiKey: config.stripe.stripeKey,
  });
};

module.exports = { processPayment, sendStripeApiKey };
