const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
const Wallet = require("../model/wallet");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");

module.exports.razorpayGuestPaymentSuccess = async (req, res) => {
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
      let checkPayment = await instance.payments.fetch(
        req.body.razorpay_payment_id
      );
      let WallettransactionId = otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const walletData = new Wallet({
        user: req.body.email,
        wallet: checkPayment.amount / 100,
        datetime: new Date().toLocaleString(),
        pay_type: "RazorPay",
        pay_id: payId,
        pay_transaction: "debited",
        transactionId: WallettransactionId,
      });
      await walletData.save();
      res.status(200).json({
        data: walletData,
      });
    } else {
      res.status(200).send("payment failed");
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
