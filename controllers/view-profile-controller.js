const User = require("../model/user")
const jwt = require('jsonwebtoken')


module.exports.viewProfile = async (req, res) => {

    try {
       
        const token = req.headers.authorization
            const verifyTokenId = jwt.verify(token, "zxcvbnm")
            const UserDetails = await User.findById(verifyTokenId.userId)
            res.status(200).json({
                data: UserDetails
            })
     
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateProfile = async (req, res) => {

    try {
        const token = req.headers.authorization
        const verifyTokenId = jwt.verify(token, "zxcvbnm")
        const newUserName = req.body.NewUserName
        const UserDetails = await User.findOne({ username: newUserName })
        if (UserDetails === null) {
            const updateData = await User.findByIdAndUpdate(verifyTokenId.userId, {username:newUserName})
            res.status(200).json({
                data: "successfully updated"
            })
        }else{
            res.status(200).json({
                data: "username is already taken"
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

