const Coupon = require("../model/coupon")


module.exports.getCoupon = async (req, res) =>{
     try {
        const CouponName=req.body.applyCouponName
        const CouponData = await Coupon.findOne({couponName:CouponName})
       if(CouponData !==null){
        res.status(200).json({
            message: CouponData
        })
       }else{
        res.status(200).json({
            message: null
        })
       }
       
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}