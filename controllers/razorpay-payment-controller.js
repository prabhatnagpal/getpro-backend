const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const Services = require("../model/services");
const Order = require("../model/order");
const ExtraCredit = require("../model/extraCredit");

module.exports.razorpayPayment = async (req, res) => {
  try {
    const amount = parseInt(req.body.amount);
    console.log("-------", amount);
    var options = {
      amount: amount * 100,
      currency: "USD",
    };
    instance.orders.create(options, function (err, order) {
      res.status(200).json({
        order,
        amount,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.razorpay_is_completed = async (req, res) => {
  try {
    console.log("bodyyyyyy", req.body);
    const payId = req.body.razorpay_payment_id;
    const orderId = req.body.razorpay_order_id;
    const signature = req.body.razorpay_signature;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    const data = hmac.update(orderId + "|" + payId);
    let generatedSignature = data.digest("hex");

    console.log("ssssss", generatedSignature);
    if (generatedSignature == signature) {
      console.log("true");
      let checkPayment = await instance.payments.fetch(
        req.body.razorpay_payment_id
      );
      console.log("*****", checkPayment);
      let extraCredit = await ExtraCredit.findOne();
      const token = req.headers.authorization;
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      const wallet = checkPayment.amount / 100;
      let WallettransactionId = otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      if (wallet >= 500) {
        const updateWallet = await User.findByIdAndUpdate(UserDetails._id, {
          wallet: UserDetails.wallet + wallet + extraCredit.extraCredit,
        });
        const walletData = new Wallet({
          user: UserDetails.email,
          wallet: wallet + extraCredit.extraCredit,
          datetime: new Date().toLocaleString(),
          pay_type: "RazorPay",
          pay_id: payId,
          pay_transaction: "credited",
          transactionId: WallettransactionId,
        });
        await walletData.save();
        res.status(200).json({
          data: walletData,
        });
      } else {
        const updateWallet = await User.findByIdAndUpdate(UserDetails._id, {
          wallet: UserDetails.wallet + wallet,
        });
        const walletData = new Wallet({
          user: UserDetails.email,
          wallet: wallet,
          datetime: new Date().toLocaleString(),
          pay_type: "RazorPay",
          pay_id: payId,
          pay_transaction: "credited",
          transactionId: WallettransactionId,
        });
        await walletData.save();
        res.status(200).json({
          data: walletData,
        });
      }
    } else {
      res.status(200).send("payment failed");
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
