const mongoose = require("mongoose");
const wallet = mongoose.Schema({
  transactionId: String,
  user: String,
  wallet: Number,
  datetime: String,
  sub_id: String,
  pay_id: String,
  pay_transaction: String,
  pay_type: String,
});

module.exports = mongoose.model("wallet", wallet);
