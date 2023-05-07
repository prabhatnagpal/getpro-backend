const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
// const corsOptions = {
//   server,
//   origin: "http://localhost:3000",
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
const io = new require("socket.io")(server);
app.set("socketIo", io);

var corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5000/chats",
    "https://81.0.246.73:3000",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
io.on("connection", (socket) => {
  console.log("Connected: ");
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  console.log("connected to socket.io", socket.handshake.query);
  console.log("socket;", socket.id);
  console.log("roomName: ", roomId);
  socket.on("message", (msg) => {
    console.log("Recieveed msg: ", msg);
    socket.broadcast.to(roomId).emit("message", msg);
  });

  // // socket.on("chat-id", (data) => {
  // //   console.log("skhgsh", 'lkdkjddkjd');
  // // });
  // // var id;
  // // console.log("99999",socket)
  // socket.on("message", (data) => {
  //   console.log("socket id >>>>>>>>>", data);
  //   // socket.to(roomId).emit("message2", "message two is here 2222");
  // });

  // socket.on("room", (room) => {
  //   socket.join(room);
  //   console.log("dkjhdkjdhkdjh");
  //   console.log("rooom", room);
  // });

  socket.on("new message", (data) => {
    console.log("8888", data.chat._id);
    socket.broadcast.emit("message2", data);
  });
});

const userRouter = require("./router/userRouter");
const adminRouter = require("./router/adminRouter");
const registerRouter = require("./router/registerRouter");
const loginRouter = require("./router/loginRouter");
const forgotPasswordRouter = require("./router/forgotPasswordRouter");
const workSamplesRouter = require("./router/workSamplesRouter");
const authorsRouter = require("./router/authorsRouter");
const faqsRouter = require("./router/faqsRouter");
const blogRouter = require("./router/blogRouter");
const servicesRouter = require("./router/servicesRouter");
const cartRouter = require("./router/cartRouter");
const logoutRouter = require("./router/logoutRouter");
const searchworksampleRouter = require("./router/searchworksampleRouter");
const searchblogRouter = require("./router/searchblogRouter");
const changePasswodRouter = require("./router/changePasswodRouter");
const careerRouter = require("./router/careerRouter");
const couponRouter = require("./router/couponRouter");
const viewProfileRouter = require("./router/viewProfileRouter");
const paymentRouter = require("./router/paymentRouter");
const getUserWalletRouter = require("./router/getUserWalletRouter");
const useWalletRouter = require("./router/useWalletRouter");
const viewOrderRouter = require("./router/viewOrderRouter");
const walletHistoryRouter = require("./router/walletHistoryRouter");
const orderStripeRouter = require("./router/orderStripePaymentRouter");
const paypalPaymentRouter = require("./router/paypalPaymentRouter");
const razorpayPaymentRouter = require("./router/razorpayPaymentRouter");
const chatRoutes = require("./router/chatRoutes");
const messageRoutes = require("./router/messageRoutes");
const orderRazorpayPayment = require("./router/orderRazorpayPayment");
const extraCreditRouter = require("./router/extraCreditRouter");
const stripeGuestPaymentRouter = require("./router/stripeGuestPaymentRouter");
const razorPayGuestPaymentRouter = require("./router/razorPayGuestPaymentRouter");
const stripeSubscriptionRouter = require("./router/stripeSubscriptionRouter");
const razorpaySubscriptionRouter = require("./router/razorpaySubscriptionRouter");
const withoutPaymentOrderRouter = require("./router/withoutPaymentOrderRouter");
const countryCodeRouter = require("./router/countryCodeRouter");
const contentTypeRouter = require("./router/contentTypeRouter");
const expertLevelRouter = require("./router/expertLevelRouter");
const getInTouchRouter = require("./router/getInTouchRouter");
const orderPaypalRouter = require("./router/orderPaypalRouter");
const paypalGuestPaymentRouter = require("./router/paypalGuestPaymentRouter");
const paypalsubscriptionRouter = require("./router/paypalsubscriptionRouter");
const ratingRouter = require("./router/ratingRouter");
const savePaymentMethodRouter = require("./router/savePaymentMethodRouter");
const UserSavePaymentMethodRouter = require("./router/userSavePaymentMethodRouter");

const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, () => {
  console.log("getpro database have connected to your project");
});

app.use(express.json());
app.use(userRouter);
app.use(adminRouter);
app.use(registerRouter);
app.use(loginRouter);
app.use(forgotPasswordRouter);
app.use(workSamplesRouter);
app.use(authorsRouter);
app.use(faqsRouter);
app.use(blogRouter);
app.use(servicesRouter);
app.use(cartRouter);
app.use(logoutRouter);
app.use(searchworksampleRouter);
app.use(searchblogRouter);
app.use(changePasswodRouter);
app.use(careerRouter);
app.use(couponRouter);
app.use(viewProfileRouter);
app.use(paymentRouter);
app.use(getUserWalletRouter);
app.use(useWalletRouter);
app.use(viewOrderRouter);
app.use(walletHistoryRouter);
app.use(orderStripeRouter);
app.use(paypalPaymentRouter);
app.use(razorpayPaymentRouter);
app.use(chatRoutes);
app.use(messageRoutes);
app.use(orderRazorpayPayment);
app.use(extraCreditRouter);
app.use(stripeGuestPaymentRouter);
app.use(razorPayGuestPaymentRouter);
app.use(stripeSubscriptionRouter);
app.use(razorpaySubscriptionRouter);
app.use(withoutPaymentOrderRouter);
app.use(countryCodeRouter);
app.use(contentTypeRouter);
app.use(expertLevelRouter);
app.use(getInTouchRouter);
app.use(orderPaypalRouter);
app.use(paypalGuestPaymentRouter);
app.use(paypalsubscriptionRouter);
app.use(ratingRouter);
app.use(savePaymentMethodRouter)
app.use(UserSavePaymentMethodRouter)

server.listen(process.env.PORT, (req, res) => {
  console.log(`Server in running on port ${process.env.PORT}`);
});
