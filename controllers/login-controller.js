const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ip = require("ip");
const axios = require("axios");
const AddCart = require("../model/addCard");

module.exports.login = async (req, res) => {
  try {
    const usernameData = await User.findOne({ username: req.body.username });
    const emailData = await User.findOne({ email: req.body.username });
    console.log(req.body);

    if (usernameData == null && emailData == null) {
      res.status(404).json({
        message: "your account does not found",
      });
    } else if (usernameData !== null) {
      let bcryptMatchPassword = await bcrypt.compare(
        req.body.password,
        usernameData.password
      );
      if (bcryptMatchPassword === true) {
        if(usernameData.type==="user"){
          if(usernameData.status==="active"){
          let userId = usernameData._id;
          var token = jwt.sign({ userId }, "zxcvbnm");
          const verifyTokenId = jwt.verify(token, "zxcvbnm");
          const UserDetails = await User.findById(verifyTokenId.userId);
          const findCartUser = await AddCart.find({
            custemerId: UserDetails.email,
          });
          for (let i = 0; i < req.body.getAllProduct.length; i++) {
            if (findCartUser.length < 1) {
              console.log("findcardlength ===0");
              let addCart = new AddCart({
                custemerId: UserDetails.email,
                productId: req.body.getAllProduct[i]._id,
                quantity: req.body.getAllProduct[i].quantity,
              });
              await addCart.save();
              const CartUser = await AddCart.find({
                custemerId: UserDetails.email,
              }).populate("productId");
            } else {
              const findUserProduct = await AddCart.findOne({
                $and: [
                  { custemerId: UserDetails.email },
                  { productId: req.body.getAllProduct[i]._id },
                ],
              });
              console.log("cartttpro", findUserProduct);
              if (findUserProduct == null) {
                console.log("finduserproduict=== nulll");
                let addCart = new AddCart({
                  custemerId: UserDetails.email,
                  productId: req.body.getAllProduct[i]._id,
                  quantity: req.body.getAllProduct[i].quantity,
                });
                await addCart.save();
                const CartUser = await AddCart.find({
                  custemerId: UserDetails.email,
                }).populate("productId");
              } else {
                console.log("ffcgccgnc", req.body.getAllProduct[i]);
                // if (quantity === 0) {
                //   let cartDelete = await AddCart.findByIdAndDelete(
                //     findUserProduct._id
                //   );
                // }
                let cartUpdate = await AddCart.findByIdAndUpdate(
                  findUserProduct._id,
                  {
                    quantity:
                      findUserProduct.quantity +
                      req.body.getAllProduct[i].quantity,
                  }
                );
                const CartUser = await AddCart.find({
                  custemerId: UserDetails.email,
                }).populate("productId");
              }
            }
          }
          axios
            .get(
              "https://ipgeolocation.abstractapi.com/v1/?api_key=3047534b15b94214bf312c827d8bb4d7"
            )
            .then(async (response) => {
              await User.findByIdAndUpdate(userId, {
                IP_Address: response.data.ip_address,
                LoginTime: new Date().toLocaleString(),
                location:
                  response.data.city +
                  " " +
                  response.data.region +
                  " " +
                  response.data.country,
                logintype: "login",
              });
              //  console.log("thissssss", response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          res.status(200).json({
            message: "successfully login",
            token: token,
            user:usernameData
          });
        }else{
            res.status(404).json({
              message: "your account is disabled",
            });
          }
        }else{
          res.status(404).json({
            message: "you are not authorized for this action",
          });
        }
      
      } else {
        res.status(404).json({
          message: "your password is incorrect",
        });
      }
    } else if (emailData !== null) {
      let bcryptMatchPassword2 = await bcrypt.compare(
        req.body.password,
        emailData.password
      );
      if (bcryptMatchPassword2 === true) {
        if(emailData.type=="user"){
          if(emailData.status==="active"){
          let userId = emailData._id;
          var token = jwt.sign({ userId }, "zxcvbnm");
          const verifyTokenId = jwt.verify(token, "zxcvbnm");
          const UserDetails = await User.findById(verifyTokenId.userId);
          const findCartUser = await AddCart.find({
            custemerId: UserDetails.email,
          });
          for (let i = 0; i < req.body.getAllProduct.length; i++) {
            if (findCartUser.length < 1) {
              console.log("findcardlength ===0");
              let addCart = new AddCart({
                custemerId: UserDetails.email,
                productId: req.body.getAllProduct[i]._id,
                quantity: req.body.getAllProduct[i].quantity,
              });
              await addCart.save();
              const CartUser = await AddCart.find({
                custemerId: UserDetails.email,
              }).populate("productId");
            } else {
              const findUserProduct = await AddCart.findOne({
                $and: [
                  { custemerId: UserDetails.email },
                  { productId: req.body.getAllProduct[i]._id },
                ],
              });
              console.log("cartttpro", findUserProduct);
              if (findUserProduct == null) {
                console.log("finduserproduict=== nulll");
                let addCart = new AddCart({
                  custemerId: UserDetails.email,
                  productId: req.body.getAllProduct[i]._id,
                  quantity: req.body.getAllProduct[i].quantity,
                });
                await addCart.save();
                const CartUser = await AddCart.find({
                  custemerId: UserDetails.email,
                }).populate("productId");
              } else {
                console.log("ffcgccgnc", req.body.getAllProduct[i]);
                // if (quantity === 0) {
                //   let cartDelete = await AddCart.findByIdAndDelete(
                //     findUserProduct._id
                //   );
                // }
                let cartUpdate = await AddCart.findByIdAndUpdate(
                  findUserProduct._id,
                  {
                    quantity:
                      findUserProduct.quantity +
                      req.body.getAllProduct[i].quantity,
                  }
                );
                const CartUser = await AddCart.find({
                  custemerId: UserDetails.email,
                }).populate("productId");
              }
            }
          }
          axios
            .get(
              "https://ipgeolocation.abstractapi.com/v1/?api_key=3047534b15b94214bf312c827d8bb4d7"
            )
            .then(async (response) => {
              await User.findByIdAndUpdate(userId, {
                IP_Address: response.data.ip_address,
                LoginTime: new Date().toLocaleString(),
                location:
                  response.data.city +
                  " " +
                  response.data.region +
                  " " +
                  response.data.country,
                logintype: "login",
              });
              console.log("thissssss", response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          res.status(200).json({
            message: "successfully login",
            token: token,
            user:emailData
          });
        }else{
          res.status(404).json({
            message: "your account is disabled",
          });
        }
        }else{
          res.status(404).json({
            message: "you are not authorized for this action",
          });
        }
       
      } else {
        res.status(404).json({
          message: "your password is incorrect",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
