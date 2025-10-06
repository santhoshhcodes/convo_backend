const http = require("http");
const app = require("./app");        // Express app
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { User, Request, Profile, Message } = require("../Model/model");
// Import all models

// Create HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// MongoDB
mongoose.connect("mongodb+srv://santhosh:santhosh@santhosh.bucwmiw.mongodb.net/convo?retryWrites=true&w=majority&appName=Santhosh", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// UserID -> socketID map
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Save online user: { userId: socket.id }
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Send message
  socket.on("sendMessage", async ({ sender, receiver, text }) => {
    const newMessage = new Message({ sender, receiver, text });
    await newMessage.save();

    // Emit to receiver if online
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) io.to(receiverSocket).emit("receiveMessage", newMessage);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove from online users
    for (let [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) onlineUsers.delete(userId);
    }
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
