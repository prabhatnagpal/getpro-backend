const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.getWalletTransactionHistory = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const UserDetails = await User.findById(verifyTokenId.userId);
    const creditHistory = await Wallet.find({
      $and: [{ user: UserDetails.email }, { pay_transaction: "credited" }],
    });
    const debitHistory = await Wallet.find({
      $and: [{ user: UserDetails.email }, { pay_transaction: "debited" }],
    });
    let totalCredit = 0;
    let totalDebit = 0;

    for (var i = 0; i < creditHistory.length; i++) {
      totalCredit += creditHistory[i].wallet;
    }
    for (var i = 0; i < debitHistory.length; i++) {
      totalDebit += debitHistory[i].wallet;
      console.log(debitHistory[i].wallet);
    }
    console.log("totalDebit", totalDebit);
    res.status(200).json({
      credit: creditHistory,
      totalCredit: totalCredit,
      debit: debitHistory,
      totalDebit: totalDebit,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
