const mongoose = require('mongoose')
const role = mongoose.Schema({
  role: String,
  permissions: [{
    type: String
  }]

})

module.exports = mongoose.model('role', role)
