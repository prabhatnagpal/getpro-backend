const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const AddCart = require("../model/addCard");
const otpGenerator = require("otp-generator");
const Services = require("../model/services");

module.exports.useWallet = async (req, res) => {
  try {
    console.log(req.body);
    const token = req.headers.authorization;
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const totalAmount = req.body.totalAmount;
    const UserDetails = await User.findById(verifyTokenId.userId);
    if (UserDetails.wallet >= totalAmount) {
      const remingAmount = UserDetails.wallet - totalAmount;
      let WallettransactionId = otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const TotleUserWallet = await User.findByIdAndUpdate(
        verifyTokenId.userId,
        { wallet: remingAmount }
      );
      const remingLastAmount = await User.findById(verifyTokenId.userId);
      const walletData = new Wallet({
        user: UserDetails.email,
        wallet: totalAmount,
        datetime: new Date().toLocaleString(),
        pay_type: "Wallet",
        pay_transaction: "debited",
        transactionId: WallettransactionId,
      });
      await walletData.save();

      //    ORDER PLACED
      const couponAmount = req.body.couponAmount;
      const couponName = req.body.couponName;
      
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
      console.log("arrr", arr);

      let orderNo ;
      var Order_id = await Order.find().sort({ $natural: -1 }).limit(1)
      if(Order_id.length<1){
       orderNo =1
      }else{
       orderNo = Order_id[0].order_id +1
      }
      const orderPlaced = new Order({
        transactionId: WallettransactionId,
        pay_method: "Wallet",
        type: "Ordered",
        email: UserDetails.email,
        datetime: new Date().toLocaleString(),
        totalAmount: totalAmount,
        CouponName: couponName,
        couponAmount: couponAmount,
        products: arr,
        status: "success",
        order_id:orderNo,
        is_order:"true"
        
      });
    const orderData=  await orderPlaced.save();

      // DELETE CART OF USER

      for (let i = 0; i < CartData.length; i++) {
        const id = CartData[i]._id;
        console.log(id);
        await AddCart.findByIdAndDelete(id);
      }

      res.status(200).json({
        data: "order Placed",
        message:orderData
      });
    } else {
      res.status(200).json({
        data: "your wallet amount is not sufficient",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
