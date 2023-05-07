const mongoose= require('mongoose')
const expertLevel = mongoose.Schema({
    expertLevel:String,
 })

module.exports= mongoose.model('expertLevel',expertLevel)