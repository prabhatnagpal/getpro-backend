const mongoose= require('mongoose')
const faqs = mongoose.Schema({
    title:String,
    dec:String,
 })

module.exports= mongoose.model('faqs',faqs)