const mongoose = require("mongoose");
const savePaymentMethod = mongoose.Schema({
  email: String,
  accountHolder: String,
  cardNumber: String,
  mm: String,
  yy: String,
  cvv: Number,
});

module.exports = mongoose.model("savePaymentMethod", savePaymentMethod);
