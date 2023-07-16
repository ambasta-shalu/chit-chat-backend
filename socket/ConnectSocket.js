const socketIo = require("socket.io");
const { onJoinRoomEvent, onGetRoomUsersEvent } = require("./SocketEvents");

function connectSocket(server) {
  io = new socketIo.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected having ID:", socket.id);

    // Joining the Room
    socket.on("joinRoomEvent", (data) => {
      onJoinRoomEvent(data, socket, io);
    });

    // Message
    socket.on("sendMessageEvent", (data) => {
      io.to(data.ROOM_CODE).emit("receiveMessageEvent", data);
    });

    // Room User Details
    socket.on("getRoomUsersEvent", (data) => {
      const roomUsers = onGetRoomUsersEvent(data, io);
      socket.emit("receiveRoomUsersEvent", roomUsers);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected having ID:", socket.id);
    });
  });
}

module.exports = { connectSocket };
