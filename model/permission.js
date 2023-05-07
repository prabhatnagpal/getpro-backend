const mongoose= require('mongoose')
const permission = mongoose.Schema({
    permission:String
  })

module.exports= mongoose.model('permission',permission)
