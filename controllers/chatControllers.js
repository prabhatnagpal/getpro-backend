const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const User = require("../model/user");
const Admin = require("../model/admin");
const jwt = require("jsonwebtoken");
const httpMsgs = require("http-msgs");
const accessChat = asyncHandler(async (req, res) => {
  try {
    var orderId = req.body.orderId;
    // console.log(orderId);
    if (orderId) {
      var isChat = await Chat.find({
        isGroupChat: false,
        orderId: orderId,
      })
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("orderId");

      isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      // console.log("========", isChat);
      if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          orderId: orderId,
          users: [req.user._id, "644e9c601d2eb2a43d1514aa"],
          latestMessage:null,
        };
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id });
        res.status(200).json(FullChat);
      }
    } else {
      res.status(400).json({ message: "send order id" });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find()
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .populate("orderId")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        console.log("results",results[0].users)
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});


const chatAssign = async (req, res) =>{
  try {
   console.log("reqqqqq",req.body)
 
    const chatId= req.body.theChatId
    const subAdminId=req.body.subAdminId
    const ChatData=await Chat.findById(chatId)
    console.log(ChatData.users[1])
    let newUsers=[ChatData.users[0],subAdminId]
    const updateUsers=await Chat.findByIdAndUpdate(chatId,{users:newUsers})
    res.redirect("/chats")
 } catch (error) {
     res.status(500).json({
         error: error.message
     })
 }
}


const checkChatAccess = async (req, res) =>{
  try {
    const adminToken=  req.cookies.adminToken
    const verifyTokenId= jwt.verify(adminToken,"zxcvbnm")
    console.log("verify",verifyTokenId.userId)
   const chatId=req.body.theChatId
    const ChatData=await Chat.findById(chatId).populate("users")
  const filterUser= await ChatData.users.filter((users)=> users.type == "admin")
   console.log("chatAssignAdmin",filterUser)
   if(verifyTokenId.userId===filterUser[0].id){
   res.send("right")
   }else{
    httpMsgs.send500(req, res, "you can't start chat because this chat is already assigned");
   }
 } catch (error) {
     res.status(500).json({
         error: error.message
     })
 }
}



module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  chatAssign,
  checkChatAccess
};
