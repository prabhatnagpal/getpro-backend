const Stripe = require("stripe");
const dotenv = require("dotenv");
const Wallet = require("../model/wallet");
const otpGenerator = require("otp-generator");
dotenv.config();
const stripe = Stripe(process.env.SECRET);

const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.payment = async (req, res) => {
  console.log(req.body);
  const wallet = req.body.wallet;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Wallet",
            },
            unit_amount: wallet * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/stripeGuestPaymentSuccess",
      cancel_url: "http://localhost:3000/fail",
    });

    res.send(200, { url: session.url, id: session.id });
    console.log(session);
  } catch (error) {
    res.send(error);
  }
};

module.exports.stripeGuestPaymentSuccess = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.pay_id && req.body.email) {
      const session = await stripe.checkout.sessions.retrieve(req.body.pay_id);
      console.log("sessionCheck", session);
      if (session.status === "complete") {
        const pay_id = req.body.pay_id;
        const wallet = session.amount_total / 100;
        let WallettransactionId = otpGenerator.generate(25, {
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const walletData = new Wallet({
          user: req.body.email,
          wallet: wallet,
          datetime: new Date().toLocaleString(),
          pay_type: "Stripe",
          pay_id: pay_id,
          pay_transaction: "debited",
          transactionId: WallettransactionId,
        });
        await walletData.save();
        res.status(200).json({
          data: walletData,
        });
      } else {
        res.status(200).json({ message: "payment failed" });
      }
    } else {
      res.status(200).json({ message: "please send pay_Id" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
