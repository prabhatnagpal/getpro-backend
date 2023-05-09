const mongoose = require("mongoose");
const orderScema = mongoose.Schema({
  transactionId: String,
  pay_id: String,
  sub_id: String,
  pay_method: String,
  email: String,
  datetime: String,
  totalAmount: Number,
  CouponName: String,
  couponAmount: Number,
  contentType: String,
  expertLevel: String,
  deadline: String,
  order_id:Number,
  products: [

    {
      id: String,
      p_title: String,
      p_shortTitle: String,
      p_dec: String,
      p_price: String,
      p_quantity: Number,
      
    }
  ],
  type: String,
  status: String,
  sub_status: String,
  is_order:String
});

module.exports = mongoose.model("order", orderScema);
