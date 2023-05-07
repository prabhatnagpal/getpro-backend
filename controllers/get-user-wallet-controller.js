const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.getUserWallet = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const TotleUserWallet = await User.findById(verifyTokenId.userId);
    res.status(200).json({
      totalWallet: TotleUserWallet.wallet,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};