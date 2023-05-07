const dotenv = require("dotenv");
dotenv.config();
const paypal = require("paypal-rest-sdk");
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const AddCart = require("../model/addCard");
const otpGenerator = require("otp-generator");
const Services = require("../model/services");
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPALCLIENTID,
  client_secret: process.env.PAYPALCLIENTSECRET,
});

module.exports.orderPaypal = async (req, res) => {
  const totalamount = req.body.totalamount;
  try {
    console.log("paypal", req.body);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/orderPaypalSuccess?paypal=true",
        cancel_url: "http://localhost:3000/orderPaypalCancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Wallet",
                sku: "001",
                price: `${totalamount}`,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: `${totalamount}`,
          },
          description: "Hat for the best team ever",
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        res.send(error);
        console.log(error);
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res
              .status(200)
              .send({ url: payment.links[i].href, id: payment.id });
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.PaypalOrderSuccess = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.pay_id) {
      const token = req.headers.authorization;
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const totalAmount = req.body.totalamount;
      const payId = req.body.pay_id;
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
        pay_type: "Paypal",
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
        pay_method: "Paypal",
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
    const orderData=  await orderPlaced.save();
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
      res.json({ message: "please send pay id" });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.PendingPaymentPaypal = async (req, res) => {
  const totalamount = req.body.totalamount;
  try {
    console.log("paypal", req.body);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/PendingPaymentPaypalSuccess",
        cancel_url: "http://localhost:3000/orderPaypalCancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Wallet",
                sku: "001",
                price: `${totalamount}`,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: `${totalamount}`,
          },
          description: "Hat for the best team ever",
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        res.send(error);
        console.log(error);
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res
              .status(200)
              .send({ url: payment.links[i].href, id: payment.id });
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.PendingPaymentPaypalSuccess = async (req, res) => {
  try {
    console.log("PendingPaymentPaypalSuccess======", req.body);
    if (req.body.pay_id && req.body.orderId) {
      const totalamount = req.body.totalamount;
      const updateOrderDetails = await Order.findByIdAndUpdate(
        req.body.orderId,
        {
          pay_id: req.body.pay_id,
          pay_method: "Paypal",
          status: "success",
          totalAmount: totalamount,
        }
      );
      const findWalletTransaction = await Wallet.findOne({
        transactionId: updateOrderDetails.transactionId,
      });
      console.log("ffiffff", findWalletTransaction);
      await Wallet.findByIdAndUpdate(findWalletTransaction._id, {
        pay_id: req.body.pay_id,
        pay_type: "Paypal",
        wallet: totalamount,
      });
      res.status(200).json({
        message: "payment Successfull",
      });
    } else {
      res.status(200).json({ message: "please send pay_id and order id" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
