const mongoose = require('mongoose')
const rating = mongoose.Schema({
  username: String,
  email:String,
  title:String,
  description:String,
  rating:Number,
  status:String
})

module.exports = mongoose.model('rating', rating)
