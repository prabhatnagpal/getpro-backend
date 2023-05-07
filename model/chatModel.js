const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: "string", trim: true },
    orderId:{ type: mongoose.Schema.Types.ObjectId, ref: "order" },
    isGroupChat: { type: "boolean", default: false },
    users: [{ type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
