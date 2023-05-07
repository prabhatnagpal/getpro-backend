const mongoose= require('mongoose')
const contentType = mongoose.Schema({
    contentType:String,
 })

module.exports= mongoose.model('contentType',contentType)