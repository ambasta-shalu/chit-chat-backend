const socketIo = require("socket.io");
const { onJoinRoomEvent, onGetRoomUsersEvent } = require("./SocketEvents");
const { fileUpload } = require("../helper/FileUpload");

function connectSocket(server) {
  io = new socketIo.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected having ID : ${socket.id}`);

    // Joining the Room
    socket.on("joinRoomEvent", (data) => {
      onJoinRoomEvent(data, socket, io);
    });

    // Message
    socket.on("sendMessageEvent", (data) => {
      if (data.TYPE === "FILE") {
        fileUpload(data);
      }
      io.to(data.ROOM_CODE).emit("receiveMessageEvent", data);
    });

    // Room User Details [USER_NAME, USER_ID]
    socket.on("getRoomUsersEvent", (data) => {
      const roomUsers = onGetRoomUsersEvent(data, io); // list of [USER_NAME, USER_ID]
      socket.emit("receiveRoomUsersEvent", roomUsers);
    });

    // Start Typing Event
    socket.on("sendStartTypingEvent", (data) => {
      socket.to(data.ROOM_CODE).emit("getStartTypingEvent", data.USER_NAME);
    });

    // Stop Typing Event
    socket.on("sendStopTypingEvent", (data) => {
      socket.to(data.ROOM_CODE).emit("getStopTypingEvent", data.USER_NAME);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected having ID:", socket.id);
    });
  });
}

module.exports = { connectSocket };
