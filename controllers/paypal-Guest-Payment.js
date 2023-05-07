const dotenv = require("dotenv");
dotenv.config();
const paypal = require("paypal-rest-sdk");
const Wallet = require("../model/wallet");
const otpGenerator = require("otp-generator");
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPALCLIENTID,
  client_secret: process.env.PAYPALCLIENTSECRET,
});

module.exports.PaypalGuestPayment = async (req, res) => {
  const amount = req.body.amount;
  try {
    console.log("paypal", req.body);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/paypalGuestPaymentSuccess",
        cancel_url: "http://localhost:3000/paypalcancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Wallet",
                sku: "001",
                price: `${amount}`,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: `${amount}`,
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

module.exports.PaypalGuestPaymentSuccess = async (req, res) => {
  console.log(req.body);
  if (req.body.pay_id && req.body.email) {
    const pay_id = req.body.pay_id;
    const amount = req.body.amount;
    let WallettransactionId = otpGenerator.generate(25, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const walletData = new Wallet({
      user: req.body.email,
      wallet: amount,
      datetime: new Date().toLocaleString(),
      pay_type: "Paypal",
      pay_id: pay_id,
      pay_transaction: "debited",
      transactionId: WallettransactionId,
    });
    await walletData.save();
    res.status(200).json({
      data: walletData,
    });
  } else {
    res.status(200).json({ message: "please send pay_Id" });
  }
};
