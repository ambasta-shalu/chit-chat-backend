const socketIo = require("socket.io");
const { onJoinRoomEvent, onGetRoomUsersEvent } = require("./SocketEvents");
const { fileUpload } = require("../helper/FileUpload");
const { deleteScheduler } = require("../helper/DeleteScheduler");

function connectSocket(server) {
  io = new socketIo.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },

    // Set the maximum HTTP request size to 100 MB (100 * 1024 * 1024 bytes)
    maxHttpBufferSize: 100 * 1024 * 1024,
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
        // Call the file upload function
        fileUpload(data);

        // Call the schedule deletion function
        deleteScheduler(data);

        // Broadcasts the message to all clients connected to the specified room, except the sender.
        socket.to(data.ROOM_CODE).emit("receiveMessageEvent", data);
      }
    });

    // Room User Details [USER_NAME, USER_ID]
    socket.on("getRoomUsersEvent", (data) => {
      // Update Room User Details
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
