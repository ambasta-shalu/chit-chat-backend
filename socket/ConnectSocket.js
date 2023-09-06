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

    // SET THE MAXIMUM HTTP REQUEST SIZE TO 100 MB (100 * 1024 * 1024 BYTES)
    maxHttpBufferSize: 100 * 1024 * 1024,
  });

  io.on("connection", (socket) => {
    console.log(`A user connected having ID : ${socket.id}`);

    // JOINING THE ROOM
    socket.on("joinRoomEvent", (data) => {
      onJoinRoomEvent(data, socket, io);
    });

    // MESSAGE
    socket.on("sendMessageEvent", (data) => {
      if (data.TYPE === "MESSAGE") {
        // BROADCASTS THE MESSAGE TO ALL CLIENTS CONNECTED TO THE SPECIFIED ROOM, EXCEPT THE SENDER.
        socket.to(data.ROOM_CODE).emit("receiveMessageEvent", data);
      } else {
        // CALL THE FILE UPLOAD FUNCTION
        fileUpload(data);

        // CALL THE SCHEDULE DELETION FUNCTION
        deleteScheduler(data);

        // BROADCASTS THE MESSAGE TO ALL CLIENTS CONNECTED TO THE SPECIFIED ROOM, EXCEPT THE SENDER.
        socket.to(data.ROOM_CODE).emit("receiveMessageEvent", data);
      }
    });

    // ROOM USER DETAILS: [USER_NAME, USER_ID]
    socket.on("getRoomUsersEvent", (data) => {
      // UPDATE ROOM USER DETAILS
      const roomUsers = onGetRoomUsersEvent(data, io); // LIST OF [USER_NAME, USER_ID]
      socket.emit("receiveRoomUsersEvent", roomUsers);
    });

    // START TYPING EVENT
    socket.on("sendStartTypingEvent", (data) => {
      socket.to(data.ROOM_CODE).emit("getStartTypingEvent", data);
    });

    // STOP TYPING EVENT
    socket.on("sendStopTypingEvent", (data) => {
      socket.to(data.ROOM_CODE).emit("getStopTypingEvent", data);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("A user disconnected having ID:", socket.id);
    });
  });
}

module.exports = { connectSocket };
