const mongoose= require('mongoose')
const extraCredit = mongoose.Schema({
    message:String,
    extraCredit:Number,
 })

module.exports= mongoose.model('extraCredit',extraCredit)