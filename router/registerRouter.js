const RegisterRouter = require('express').Router()
const RegisterController = require("../controllers/register-controller")


RegisterRouter
    .route('/register')
    .post(RegisterController.register);

module.exports=RegisterRouter