const mongoose= require('mongoose')
const query = mongoose.Schema({
    fullName:String,
    email:String,
    subject:String,
    message:String,
    dateTime:String
  
})

module.exports= mongoose.model('query',query)

