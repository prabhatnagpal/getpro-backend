const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const Services = require("../model/services");
const Order = require("../model/order");
const AddCart = require("../model/addCard");

module.exports.withoutPaymentOrder = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const totalAmount = req.body.totalAmount;
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
      pay_type: "Pending",
      pay_id: "Pending",
      pay_transaction: "debited",
      transactionId: WallettransactionId,
    });
    await walletData.save();
    let CartData = await AddCart.find({ custemerId: UserDetails.email });
    console.log(CartData);
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
    let orderNo ;
    var Order_id = await Order.find().sort({ $natural: -1 }).limit(1)
    if(Order_id.length<1){
     orderNo =1
    }else{
     orderNo = Order_id[0].order_id +1
    }
  
    const orderPlaced = new Order({
      transactionId: WallettransactionId,
      pay_id: "Pending",
      pay_method: "Pending",
      type: "Ordered",
      email: UserDetails.email,
      datetime: new Date().toLocaleString(),
      totalAmount: totalAmount,
      CouponName: couponName,
      couponAmount: couponAmount,
      products: arr,
      status: "Pending",
      order_id:orderNo,
      is_order:"true"
    });
   const orderData= await orderPlaced.save();
    // DELETE CART OF USER

    for (let i = 0; i < CartData.length; i++) {
      const id = CartData[i]._id;
      await AddCart.findByIdAndDelete(id);
    }
    res.status(200).json({
      data: "order Placed",
      message:orderData
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
