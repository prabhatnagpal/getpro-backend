const Stripe = require("stripe");
const dotenv = require("dotenv");
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const Services = require("../model/services");
const Order = require("../model/order");
const ExtraCredit = require("../model/extraCredit");
dotenv.config();
const stripe = Stripe(process.env.SECRET);

const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.stripeSubscription = async (req, res) => {
  try {
    console.log(req.params.id);
    const token = req.headers.authorization;
    console.log("token", token);
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const UserDetails = await User.findById(verifyTokenId.userId);
    console.log("details", UserDetails);
    const FindProduct = await Services.findById(req.params.id);

    let customer = await stripe.customers.create({
      email: UserDetails.email,
      description: "New Customer",
    });
    console.log("cust", customer);
    customer = customer.id;

    // create product

    const product = await stripe.products.create({
      name: "test_product",
    });

    // create price

    const price = await stripe.prices.create({
      unit_amount: FindProduct.price * 100,
      currency: "USD",
      recurring: { interval: "day" },

      product: product.id,
    });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer,

      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],

      success_url: "http://localhost:3000/StripeSubscription",
      cancel_url: "http://localhost:3000/cancel",
    });
    console.log("session", session);

    res.status(200).send({ url: session.url, id: session.id });
  } catch (error) {
    res.json({ message: error });
  }
};

module.exports.verifyStripeSubscriptionPayment = async (req, res) => {
  try {
    if (req.body.pay_id) {
      const session = await stripe.checkout.sessions.retrieve(req.body.pay_id);
      console.log("sessionCheck", session);
      if (session.status === "complete") {
        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const UserDetails = await User.findById(verifyTokenId.userId);
        console.log("token", UserDetails);
        //    ORDER PLACED

        let WallettransactionId = await otpGenerator.generate(25, {
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const walletData = new Wallet({
          user: UserDetails.email,
          wallet: session.amount_total / 100,
          datetime: new Date().toLocaleString(),
          pay_type: "Stripe",
          pay_id: req.body.pay_id,
          sub_id: session.subscription,
          pay_transaction: "debited",
          transactionId: WallettransactionId,
        });
        await walletData.save();
        // const FindProduct = await Services.findById(
        //   planDetails.notes.notes_key_1
        // );
        //  console.log("rrreswwww", FindProduct);
        let obj = {
          id: "35454656575765",
          p_title: "title",
          p_shortTitle: "shortTitle",
          p_dec: "dec",
          p_price: 10,
        };

        let orderNo ;
        var Order_id = await Order.find().sort({ $natural: -1 }).limit(1)
        if(Order_id.length<1){
         orderNo =1
        }else{
         orderNo = Order_id[0].order_id +1
        }


        const orderPlaced = new Order({
          transactionId: WallettransactionId,
          sub_id: session.subscription,
          pay_id: req.body.pay_id,
          pay_method: "Stripe",
          type: "subscription",
          email: UserDetails.email,
          totalAmount: session.amount_total / 100,
          datetime: new Date().toLocaleString(),
          products: obj,
          status: "success",
          sub_status: "Active",
          order_id:orderNo,
          is_order:"true"
        });
        await orderPlaced.save();

        // UPDATE SUBSCRIPTION
        const product = await stripe.products.create({
          name: "test_product",
        });
        const price = await stripe.prices.create({
          unit_amount: session.amount_total - (session.amount_total / 100) * 20,
          currency: "USD",
          recurring: { interval: "day" },
          product: product.id,
        });
        // const subscriptionItem = await stripe.subscriptionItems.update(
        //   "sub_1MbJK0SEjSbQ2eSg56pmdvXC",
        //   { metadata: { order_id: price.id } }
        // );
        const subscriptiionDetaiils = await stripe.subscriptions.retrieve(
          session.subscription
        );
        console.log("subscriptiondtails", subscriptiionDetaiils);
        stripe.subscriptions.update(session.subscription, {
          items: [
            {
              id: subscriptiionDetaiils.items.data[0].id,
              price: price.id,
            },
          ],
          proration_behavior: "none", // we do not want to bill or prorate users on toggle
        });
        res.json({ message: "subscriptiion successfull" });
      } else {
        res.json({ message: "payment failed" });
      }
    } else {
      res.json({ message: "please send payment id" });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};