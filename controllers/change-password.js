const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

module.exports.changePassword = async (req, res) => {
    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword
    const confirmPassword = req.body.confirmPassword
    try {
        const token = req.headers.authorization
        const verifyTokenId = jwt.verify(token, "zxcvbnm")
        const UserDetails = await User.findById(verifyTokenId.userId)
        let bcryptMatchPassword2 = await bcrypt.compare(currentPassword, UserDetails.password)
        if (bcryptMatchPassword2 == true) {
            if (newPassword === confirmPassword) {
                let password = await bcrypt.hash(confirmPassword, 10)
                await User.findByIdAndUpdate(UserDetails._id, { password: password })
                res.status(200).json({
                    message: "password successfully changed"
                })
            }else{
                res.status(200).json({
                    message: "newpassword and confirmpassword dose not match"
                })
            }
        } else {
            res.status(404).json({
                message: "current password dose not match"
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }


}