const dotenv = require("dotenv");
dotenv.config();
const paypal = require("paypal-rest-sdk");
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const ExtraCredit = require("../model/extraCredit");
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPALCLIENTID,
  client_secret: process.env.PAYPALCLIENTSECRET,
});

module.exports.PaypalPayment = async (req, res) => {
  const wallet = req.body.wallet;
  try {
    console.log("paypal", req.body);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/payplesuccess",
        cancel_url: "http://localhost:3000/paypalcancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Wallet",
                sku: "001",
                price: `${wallet}`,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: `${wallet}`,
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

module.exports.PaypalPaymentSuccess = async (req, res) => {
  try {
    //   const payerId = req.query.PayerID;
    //   const paymentId = req.query.paymentId;
    //   const execute_payment_json = {
    //     "payer_id": payerId,
    //     "transactions": [{
    //         "amount": {
    //             "currency": "USD",
    //             "total": "5"
    //         }
    //     }]
    //   };
    //   paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    //   if (error) {
    //       console.log(error.response);
    //       throw error;
    //   } else {
    //     console.log(payment)
    //       res.json(payment);c
    //   }
    // })
    // console.log("====",req.query)

    console.log(req.body);
    if (req.body.pay_id) {
      const token = req.headers.authorization;
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      const wallet = req.body.wallet;
      const pay_id = req.body.pay_id;
      let extraCredit = await ExtraCredit.findOne();
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
          pay_type: "Paypal",
          pay_id: pay_id,
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
          pay_type: "Paypal",
          pay_id: pay_id,
          pay_transaction: "credited",
          transactionId: WallettransactionId,
        });
        await walletData.save();
        res.status(200).json({
          data: walletData,
        });
      }
    } else {
      res.json({ message: "please send pay id" });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
