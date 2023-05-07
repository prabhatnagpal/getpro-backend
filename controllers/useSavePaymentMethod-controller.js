const Stripe = require("stripe");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const SavePaymentMethod = require("../model/savePaymentMethod");
const stripe = Stripe(process.env.SECRET);
const Razorpay = require("razorpay");
const crypto = require("crypto");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createCharge = async (tokenId, amount) => {
  let charge = {};
  try {
    charge = await stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: tokenId,
      description: "My first payment",
    });
  } catch (error) {
    charge.error = error.message;
  }
  return charge;
};

module.exports.UseSavePaymentMethod = async (req, res) => {
  try {
    console.log("qwertfdgfdsdfg", req.body);
    const id = req.body.id;
    const SavePaymentDetails = await SavePaymentMethod.findById(id);
    console.log(SavePaymentDetails);
    const createToken = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: "4000000000003055",
        exp_month: 8,
        exp_year: 2024,
        cvc: "314",
      },
    });

    console.log("createToken", createToken);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "usd",
      payment_method: createToken.id,
      confirmation_method: "automatic",
      capture_method: "automatic",
      confirm: true,
    });

    console.log("paymentIntent", paymentIntent);

    const capturePayment = await stripe.paymentIntents.confirm(
      paymentIntent.id
    );

    console.log("capturePayment", capturePayment);

    // const charge = await createCharge(createToken.id, 2000);
    // if (charge && charge.status == "succeeded") {
    //   req.flash("success", "Payment completed.");
    // } else {
    //   req.flash("danger", "Payment failed.");
    // }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.usesaveRazorpayPayment = async (req, res) => {
  try {
    const TotalAmount = parseInt(req.body.amount);

    var options = {
      amount: TotalAmount * 100,
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      res.status(200).json({
        order,
        amount: TotalAmount,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
