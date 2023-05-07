const User = require('../model/user')
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');

module.exports.forgetPassword = async (req, res) => {

    //  let password = await bcrypt.hash(req.body.password, 10)
    try {
        let existEmail = await User.findOne({ email: req.body.email })
        let otp = otpGenerator.generate(10, { upperCaseAlphabets: false, specialChars: false });
        let password = await bcrypt.hash(otp, 10)
        if (existEmail !== null) {
            await User.findByIdAndUpdate(existEmail._id, { password: password })
            const mailTransporter = nodemailer.createTransport({
                host: `smtp.gmail.com`,
                port: 465,
                secure: true,
                auth: {
                    "user": "bablusaini90310@gmail.com",
                    "pass": "ugczuoedytcgkqtr"
                }
            })
            let mailDetails = {
                from: 'bablusaini90310@gmail.com',
                to: req.body.email,
                subject: 'Test mail',
                text: otp
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log(err)
                } else {

                    console.log(otp)

                    res.status(200).json({
                        message: "mail have sent successfully"
                    })
                }
            });
        } else {
            res.status(404).json({
                message: 'your email is not exist'
            })
        }

    } catch (error) {
        res.json({
            error: error.message
        })
    }
};
