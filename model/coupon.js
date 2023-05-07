const mongoose= require('mongoose')
const coupon = mongoose.Schema({
    couponName:String,
    couponType:String,
    offAmount:Number,
    status:String
 })

module.exports= mongoose.model('coupon',coupon)