const mongoose= require('mongoose')
const career = mongoose.Schema({
    careerName:String,
    
 })

module.exports= mongoose.model('career',career)