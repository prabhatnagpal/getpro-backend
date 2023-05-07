const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const AddCart = require("../model/addCard");
const otpGenerator = require("otp-generator");
const Services = require("../model/services");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.orderRazorpayPayment = async (req, res) => {
  try {
    const TotalAmount = parseInt(req.body.amount);

    var options = {
      amount: TotalAmount * 100,
      currency: "USD",
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

module.exports.orderRazorpaySuccess = async (req, res) => {
  try {
    console.log("boodddyyy", req.body);
    const payId = req.body.razorpay_payment_id;
    const orderId = req.body.razorpay_order_id;
    const signature = req.body.razorpay_signature;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    const data = hmac.update(orderId + "|" + payId);
    let generatedSignature = data.digest("hex");

    console.log("ssssss", generatedSignature);

    if (generatedSignature == signature) {
      let checkPayment = await instance.payments.fetch(payId);
      const token = req.headers.authorization;
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const totalAmount = checkPayment.amount / 100;
      const UserDetails = await User.findById(verifyTokenId.userId);
      //    ORDER PLACED
      const couponAmount = req.body.couponAmount;
      const couponName = req.body.couponName;
      let WallettransactionId = otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const walletData = new Wallet({
        user: UserDetails.email,
        wallet: totalAmount,
        datetime: new Date().toLocaleString(),
        pay_id: payId,
        pay_type: "Razorpay",
        pay_transaction: "debited",
        transactionId: WallettransactionId,
      });
      await walletData.save();
      let CartData = await AddCart.find({ custemerId: UserDetails.email });
      console.log("dddd", CartData);
      let arr = [];
      for (let i = 0; i < CartData.length; i++) {
        const element = CartData[i];
        const FindProduct = await Services.findById(element.productId);
        let obj = {
          id: FindProduct.id,
          p_title: FindProduct.title,
          p_shortTitle: FindProduct.shortTitle,
          p_dec: FindProduct.dec,
          p_price: FindProduct.price,
          p_quantity: element.quantity,
        };

        arr.push(obj);
      }
      console.log("arrrr", arr);

      let orderNo ;
      var Order_id = await Order.find().sort({ $natural: -1 }).limit(1)
      if(Order_id.length<1){
       orderNo =1
      }else{
       orderNo = Order_id[0].order_id +1
      }

      const orderPlaced = new Order({
        transactionId: WallettransactionId,
        pay_id: payId,
        pay_method: "RazorPay",
        type: "Ordered",
        email: UserDetails.email,
        datetime: new Date().toLocaleString(),
        totalAmount: totalAmount,
        CouponName: couponName,
        couponAmount: couponAmount,
        products: arr,
        status: "success",
        order_id:orderNo
      });
     const orderData= await orderPlaced.save();
      console.log("oooo", orderPlaced);
      // DELETE CART OF USER

      for (let i = 0; i < CartData.length; i++) {
        const id = CartData[i]._id;
        await AddCart.findByIdAndDelete(id);
      }
      res.status(200).json({
        data: "order Placed",
        message:orderData
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

module.exports.PendingPaymentRazorpay = async (req, res) => {
  try {
    const TotalAmount = parseInt(req.body.amount);
    console.log(req.body);

    var options = {
      amount: TotalAmount * 100,
      currency: "USD",
    };
    instance.orders.create(options, function (err, order) {
      console.log(order);
      res.status(200).json({
        order,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.PendingPaymentRazorpaySuccess = async (req, res) => {
  try {
    const payId = req.body.razorpay_payment_id;
    const orderId = req.body.razorpay_order_id;
    const signature = req.body.razorpay_signature;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    console.log("booddd", req.body);
    const data = hmac.update(orderId + "|" + payId);
    let generatedSignature = data.digest("hex");

    console.log("ssssss", generatedSignature);

    if (generatedSignature == signature) {
      let checkPayment = await instance.payments.fetch(payId);
      const wallet = checkPayment.amount / 100
      const updateOrderDetails = await Order.findByIdAndUpdate(
        req.body.orderId,
        {
          pay_id: payId,
          pay_method: "Razorpay",
          status: "success",
          totalAmount:wallet
        }
      );
      console.log("updateOrderDetails", updateOrderDetails);
      const findWalletTransaction = await Wallet.findOne({
        transactionId: updateOrderDetails.transactionId,
      });

      console.log("ffiffff", findWalletTransaction);
      await Wallet.findByIdAndUpdate(findWalletTransaction._id, {
        pay_id: payId,
        pay_type: "Razorpay",
        wallet:wallet
      });
      res.status(200).json({
        message: "payment Successfull",
      });
    } else {
      res.status(200).json({
        message: "Payment failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
