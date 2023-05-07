const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Permission = require("../model/permission");
const Role = require("../model/role");

module.exports.checkLogin = async (req, res, next) => {
  if (req.cookies.adminToken === undefined) {
    res.redirect("/getproadmin");
  } else {
    next();
  }
};

module.exports.checkFaq = async (req, res, next) => {
  if (req.cookies.adminToken === undefined) {
    res.redirect("/getproadmin");
  } else {
    const pagePermissionName = req.originalUrl;
    console.log("pagePermissionName", pagePermissionName);
    let token = req.cookies.adminToken;

    if (token) {
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId).populate(
        "role"
      );

      if (UserDetails.email == "getproadmin000@gmail.com") {
        next();
      } else {
        let trueVer = false;
        for (let i = 0; i < UserDetails.role.permissions.length; i++) {
          const permissionNames = await UserDetails.role.permissions[i];
          console.log("============================d======", permissionNames);
          if ("/" + permissionNames === pagePermissionName) {
            trueVer = true;
            next();
          }
        }
        if (trueVer === false) {
          res.redirect("/pageNotFound");
        }
      }
    }
  }
};

// module.exports.checkBlog = async (req, res, next) => {
//   if (req.cookies.adminToken === undefined) {
//     res.redirect("/getproadmin");
//   } else {
//     let token = req.cookies.adminToken
//     console.log(token)
//     if (token) {
//       const verifyTokenId = jwt.verify(token, "zxcvbnm");
//       const UserDetails = await User.findById(verifyTokenId.userId).populate("role");
//       console.log("=====", UserDetails.role)
//       var trueVer;
//       for (let i = 0; i < UserDetails.role.permissions.length; i++) {
//         const permissionId = UserDetails.role.permissions[i];
//         console.log("============", permissionId)
//         const permissionNames = await Permission.findById(permissionId)
//         console.log("==================================", permissionNames)
//         if (permissionNames.permission == "blog") {
//           next()
//         } else {
//           trueVer = false
//         }
//       }
//       console.log(trueVer)
//       if (trueVer == false) {
//         res.json({ message: "you are not autorized" })
//       }

//     }
//   }
// };

// module.exports.checkwork_sample = async (req, res, next) => {
//   if (req.cookies.adminToken === undefined) {
//     res.redirect("/getproadmin");
//   } else {
//     let token = req.cookies.adminToken
//     console.log(token)
//     if (token) {
//       const verifyTokenId = jwt.verify(token, "zxcvbnm");
//       const UserDetails = await User.findById(verifyTokenId.userId).populate("role");
//       console.log("=====", UserDetails.role)
//       let trueVer;
//       for (let i = 0; i < UserDetails.role.permissions.length; i++) {
//         const permissionId = UserDetails.role.permissions[i];
//         console.log("============", permissionId)
//         const permissionNames = await Permission.findById(permissionId)
//         console.log("==================================", permissionNames)
//         if (permissionNames.permission == "work-sample") {
//           trueVer = true
//           next()
//         } else {
//           trueVer = false
//         }
//       }
//       console.log(trueVer)
//       if (trueVer == false) {
//         res.json({ message: "you are not autorized" })
//       }

//     }
//   }
// };

// module.exports.checkAuthor = async (req, res, next) => {
//   if (req.cookies.adminToken === undefined) {
//     res.redirect("/getproadmin");
//   } else {
//     let token = req.cookies.adminToken
//     console.log(token)
//     if (token) {
//       const verifyTokenId = jwt.verify(token, "zxcvbnm");
//       const UserDetails = await User.findById(verifyTokenId.userId).populate("role");
//       console.log("=====", UserDetails.role)
//       let trueVer;
//       for (let i = 0; i < UserDetails.role.permissions.length; i++) {
//         const permissionId = UserDetails.role.permissions[i];
//         console.log("============", permissionId)
//         const permissionNames = await Permission.findById(permissionId)
//         console.log("==================================", permissionNames)
//         if (permissionNames.permission == "author") {
//           trueVer = true
//           next()
//         } else {
//           trueVer = false
//         }
//       }
//       console.log(trueVer)
//       if (trueVer == false) {
//         res.json({ message: "you are not autorized" })
//       }

//     }
//   }
// };

// module.exports.checkServices = async (req, res, next) => {
//   if (req.cookies.adminToken === undefined) {
//     res.redirect("/getproadmin");
//   } else {
//     let token = req.cookies.adminToken
//     console.log(token)
//     if (token) {
//       const verifyTokenId = jwt.verify(token, "zxcvbnm");
//       const UserDetails = await User.findById(verifyTokenId.userId).populate("role");
//       console.log("=====", UserDetails.role)
//       let trueVer;
//       for (let i = 0; i < UserDetails.role.permissions.length; i++) {
//         const permissionId = UserDetails.role.permissions[i];
//         console.log("============", permissionId)
//         const permissionNames = await Permission.findById(permissionId)
//         console.log("==================================", permissionNames)
//         if (permissionNames.permission == "services") {
//           trueVer = true
//           next()
//         } else {
//           trueVer = false
//         }
//       }
//       console.log(trueVer)
//       if (trueVer == false) {
//         res.json({ message: "you are not autorized" })
//       }

//     }
//   }
// };

// module.exports.checkContactUs = async (req, res, next) => {
//   if (req.cookies.adminToken === undefined) {
//     res.redirect("/getproadmin");
//   } else {
//     let token = req.cookies.adminToken
//     console.log(token)
//     if (token) {
//       const verifyTokenId = jwt.verify(token, "zxcvbnm");
//       const UserDetails = await User.findById(verifyTokenId.userId).populate("role");
//       console.log("=====", UserDetails.role)
//       let trueVer;
//       for (let i = 0; i < UserDetails.role.permissions.length; i++) {
//         const permissionId = UserDetails.role.permissions[i];
//         console.log("============", permissionId)
//         const permissionNames = await Permission.findById(permissionId)
//         console.log("==================================", permissionNames)
//         if (permissionNames.permission == "contact us") {
//           trueVer = true
//           next()
//         } else {
//           trueVer = false
//         }
//       }
//       console.log(trueVer)
//       if (trueVer == false) {
//         res.json({ message: "you are not autorized" })
//       }

//     }
//   }
// };
