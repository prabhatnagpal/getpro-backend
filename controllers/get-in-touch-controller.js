const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Wallet = require("../model/wallet");
const Order = require("../model/order");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

module.exports.getInTouch = async (req, res) => {
  try {
    let username = req.body.username;
    let email = req.body.email;
    let Originalpassword = req.body.password;
    let password = await bcrypt.hash(Originalpassword, 10);
    let contentType = req.body.contentType;
    let expertLevel = req.body.expertLevel;
    let deadline = req.body.deadline;

    const UserToken = req.headers.authorization;
    console.log("UserToken",UserToken)
    if (!UserToken) {
      //   CREATE USER
      let existUsername = await User.findOne({ username: username });
      let existEmail = await User.findOne({ email: email });
      if (existUsername === null) {
        if (existEmail === null) {
          axios
            .get(
              "https://ipgeolocation.abstractapi.com/v1/?api_key=3047534b15b94214bf312c827d8bb4d7"
            )
            .then(async (response) => {
              console.log("thissssss", response.data);

              //  CREATE USER

              const userData = new User({
                username: username,
                email: email,
                password: password,
                status: "active",
                wallet: 0,
                IP_Address: response.data.ip_address,
                registerTime: new Date().toLocaleString(),
                loginTime: new Date().toLocaleString(),
                location:
                  response.data.city +
                  " " +
                  response.data.region +
                  " " +
                  response.data.country,
                logintype: "login",
                type:"user"
              });
              await userData.save();

              // CREATE WALLET HISTORY

              const userId = userData._id;
              var token = jwt.sign({ userId }, "zxcvbnm");
              const verifyTokenId = jwt.verify(token, "zxcvbnm");
              const UserDetails = await User.findById(verifyTokenId.userId);
              let WallettransactionId = otpGenerator.generate(25, {
                upperCaseAlphabets: false,
                specialChars: false,
              });

              console.log("tttttttttt",token)
              console.log(verifyTokenId)

              const walletData = new Wallet({
                user: UserDetails.email,
                datetime: new Date().toLocaleString(),
                pay_type: "Pending",
                pay_id: "Pending",
                pay_transaction: "debited",
                transactionId: WallettransactionId,
              });
              await walletData.save();

              // CREATE ORDER

              let orderNo ;
              var Order_id = await Order.find().sort({ $natural: -1 }).limit(1)
              if(Order_id.length<1){
               orderNo =1
              }else{
               orderNo = Order_id[0].order_id +1
              }

              const orderPlaced = new Order({
                transactionId: WallettransactionId,
                pay_id: "Pending",
                pay_method: "Pending",
                type: "Customize",
                email: UserDetails.email,
                datetime: new Date().toLocaleString(),

                contentType: contentType,
                expertLevel: expertLevel,
                deadline: deadline,
                status: "Pending",
                order_id:orderNo
              });
              await orderPlaced.save();

              //  SEND EMAIL FOR ADMIN

              const mailTransporter = nodemailer.createTransport({
                host: `smtp.gmail.com`,
                port: 465,
                secure: true,
                auth: {
                  user: "bablusaini90310@gmail.com",
                  pass: "ugczuoedytcgkqtr",
                },
              });
              let mailDetails = {
                from: "bablusaini90310@gmail.com",
                to: "bablusaini90310@gmail.com",
                subject: "Test mail",
                html: `

        <!doctype html>
        <html lang="en">
          <head>
          
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        
           
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        
            <title>Hello, world!</title>
            <style>
                  .background{
                   
                  }
           </style>
          </head>
         
          <body>
          <div style="width:450px">
          <label style="background:#03979c;display:block;text-align:center;color:white;padding:80px 0px">
              <h1 style="margin:0;">
              A new registration successfully
              </h1>
              <p style="margin:0;font-size:14px;">User Details</p>
          </label>
          <label style="width:100%;display:block;background:#ebebeb;padding:14px;box-sizing:border-box;font-size:14px">
               <p style="margin-top:0"> username :<b style="margin-left:40px">${username}</b></p>
           
                <p> email :<b style="margin-left:40px">${email}</b></p>
          </label>
      </div> 
         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
         </body>
        </html>
        `,
              };

              mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(otp);

                  res.status(200).json({
                    message: "mail have sent successfully",
                  });
                }
              });

              //  EMAIL SENT TO USER

              const usermailTransporter = nodemailer.createTransport({
                host: `smtp.gmail.com`,
                port: 465,
                secure: true,
                auth: {
                  user: "bablusaini90310@gmail.com",
                  pass: "ugczuoedytcgkqtr",
                },
              });
              let usermailDetails = {
                from: "bablusaini90310@gmail.com",
                to: `${email}`,
                subject: "Test mail",
                html: `

        <!doctype html>
        <html lang="en">
          <head>
          
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        
           
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        
            <title>Hello, world!</title>
            <style>
                  .background{
                   
                  }
           </style>
          </head>
         
          <body>
          <div style="width:450px">
          <label style="background:#03979c;display:block;text-align:center;color:white;padding:80px 0px">
              <h1 style="margin:0;">
              thank you for registration 
              </h1>
              <p style="margin:0;font-size:14px;">please check you creadention blow</p>
          </label>
          <label style="width:100%;display:block;background:#ebebeb;padding:14px;box-sizing:border-box;font-size:14px">
          <h5>User details</h5>
               <p style="margin-top:0"> username :<b style="margin-left:40px">${username}</b></p>
           
                <p> email :<b style="margin-left:40px">${email}</b></p>
            <h5>Order details</h5>
                <p style="margin-top:0"> content type :<b style="margin-left:40px">${contentType}</b></p>
            
                 <p> expert :<b style="margin-left:40px">${expertLevel}</b></p>
          </label>
      </div> 
         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
         </body>
        </html>
        `,
              };

              usermailTransporter.sendMail(
                usermailDetails,
                function (err, data) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(otp);

                    res.status(200).json({
                      message: "mail have sent successfully",
                    });
                  }
                }
              );

              res.status(201).json({
                message: "successfully login and order",
                token: token,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          res.json({ message: "your email is already exist" });
        }
      } else {
        res.json({ message: "your useranem is already exist" });
      }
    } else {
      // CREATE WALLET HISTORY

      const verifyTokenId = jwt.verify(UserToken, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      let WallettransactionId = otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const walletData = new Wallet({
        user: UserDetails.email,
        datetime: new Date().toLocaleString(),
        pay_type: "Pending",
        pay_id: "Pending",
        pay_transaction: "debited",
        transactionId: WallettransactionId,
      });
      await walletData.save();

      // CREATE ORDER

      let orderNo;
      var Order_id = await Order.find().sort({ $natural: -1 }).limit(1);
      if (Order_id.length < 1) {
        orderNo = 1;
      } else {
        orderNo = Order_id[0].order_id + 1;
      }

      const orderPlaced = new Order({
        transactionId: WallettransactionId,
        pay_id: "Pending",
        pay_method: "Pending",
        type: "Customize",
        email: UserDetails.email,
        datetime: new Date().toLocaleString(),
        contentType: contentType,
        expertLevel: expertLevel,
        deadline: deadline,
        status: "Pending",
        order_id: orderNo,
       
      });
      await orderPlaced.save();

      res.status(201).json({
        message: "Order successfully",
        token:UserToken
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
