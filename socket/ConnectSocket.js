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
    maxHttpBufferSize: 50 * 1024 * 1024, // Set the maximum HTTP request size to 50 MB (50 * 1024 * 1024 bytes)
  });

  io.on("connection", (socket) => {
    console.log(`A user connected having ID : ${socket.id}`);

    // Joining the Room
    socket.on("joinRoomEvent", (data) => {
      onJoinRoomEvent(data, socket, io);
    });

    // Message
    socket.on("sendMessageEvent", (data) => {
      if (data.TYPE === "MESSAGE") {
        // Broadcasts the message to all clients connected to the specified room, except the sender.
        socket.to(data.ROOM_CODE).emit("receiveMessageEvent", data);
      } else {
        fileUpload(data);
        // Broadcasts the message to all clients connected to the specified room
        // across the entire Socket.IO server, including the sender
        io.to(data.ROOM_CODE).emit("receiveMessageEvent", data);
      }
    });

    // Room User Details [USER_NAME, USER_ID]
    socket.on("getRoomUsersEvent", (data) => {
      const roomUsers = onGetRoomUsersEvent(data, io); // list of [USER_NAME, USER_ID]
      socket.emit("receiveRoomUsersEvent", roomUsers);
    });

    // Start Typing Event
    socket.on("sendStartTypingEvent", (data) => {
      socket.to(data.ROOM_CODE).emit("getStartTypingEvent", data);
    });

    // Stop Typing Event
    socket.on("sendStopTypingEvent", (data) => {
      socket.to(data.ROOM_CODE).emit("getStopTypingEvent", data);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected having ID:", socket.id);
    });
  });
}

module.exports = { connectSocket };
