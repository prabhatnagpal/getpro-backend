const mongoose= require('mongoose')
const prices = mongoose.Schema({
    name:String,
    oneDay:Number,
    twoDay:Number,
    fiveDay:Number
  
})

module.exports= mongoose.model('prices',prices)

