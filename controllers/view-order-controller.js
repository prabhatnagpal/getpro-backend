const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const Services = require("../model/services");

module.exports.viewOrder = async (req, res) => {
    try {
        const token = req.headers.authorization;
        console.log("token",token)
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const UserDetails = await User.findById(verifyTokenId.userId)
        let OrderData = await Order.find({ email: UserDetails.email })
        
        res.status(200).json({
            data: OrderData,
           
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}