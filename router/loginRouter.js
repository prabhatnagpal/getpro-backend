const LoginRouter = require('express').Router()
const LoginController = require("../controllers/login-controller")


LoginRouter
    .route('/login')
    .post(LoginController.login);

module.exports=LoginRouter