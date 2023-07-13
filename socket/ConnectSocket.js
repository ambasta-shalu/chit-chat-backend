const socketIo = require("socket.io");

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
  });
}

module.exports = { connectSocket };
