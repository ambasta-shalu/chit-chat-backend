function onJoinRoomEvent(data, socket, io) {
  if (data.IS_NEW_ROOM) {
    // USER JOIN IN NEW ROOM
    socket.join(data.ROOM_CODE);
    socket.data.USER_NAME = data.USER_NAME; // SAVE THE USER_NAME IN SOCKET.DATA
    socket.data.USER_ID = data.USER_ID; // SAVE THE USER_ID IN SOCKET.DATA

    socket.emit("toastEvent", `Welcome to Chit Chat ${data.USER_NAME} !`);
  } else {
    // user join in existing room
    // check if ROOM_CODE exists
    const roomExists =
      io.of("/").adapter.rooms && io.of("/").adapter.rooms.has(data.ROOM_CODE);

    if (roomExists) {
      socket.join(data.ROOM_CODE);
      socket.data.USER_NAME = data.USER_NAME; // SAVE THE USER_NAME IN SOCKET.DATA
      socket.data.USER_ID = data.USER_ID; // SAVE THE USER_ID IN SOCKET.DATA
      socket
        .to(data.ROOM_CODE)
        .emit("toastEvent", `${data.USER_NAME} has Joined the Room`);

      // UPDATE ROOM USER DETAILS
      let roomUsers = onGetRoomUsersEvent(data, io);
      socket.to(data.ROOM_CODE).emit("receiveRoomUsersEvent", roomUsers);

      socket.emit("toastEvent", `Welcome to Chit Chat ${data.USER_NAME} !`);

      // EMIT TOAST EVENT WHEN USER LEAVES THE ROOM
      socket.on("disconnecting", () => {
        const disconnectedUser = roomUsers.find(
          (user) => user[1] === socket.data.USER_ID
        );
        if (disconnectedUser) {
          socket
            .to(data.ROOM_CODE)
            .emit("toastEvent", `${socket.data.USER_NAME} has left the Room`);
        }

        // UPDATE ROOM USER DETAILS AND EXCLUDE THE DISCONNECTED USER
        roomUsers = onGetRoomUsersEvent(data, io, socket.data.USER_ID);
        socket.to(data.ROOM_CODE).emit("receiveRoomUsersEvent", roomUsers);
      });
    } else {
      socket.emit(
        "errorEvent",
        `Landed NOWHERE! No ${data.ROOM_CODE} found 😑`
      );
    }
  }
}

function onGetRoomUsersEvent(data, io, excludeUserId = null) {
  const room = io.sockets.adapter.rooms.get(data.ROOM_CODE);
  if (room) {
    const users = [];
    room.forEach((socketId) => {
      const socket = io.sockets.sockets.get(socketId);
      if (
        socket &&
        socket.data &&
        socket.data.USER_NAME &&
        socket.data.USER_ID &&
        socket.data.USER_ID !== excludeUserId
      ) {
        users.push([socket.data.USER_NAME, socket.data.USER_ID]);
      }
    });
    return users;
  }
  return [];
}

module.exports = { onJoinRoomEvent, onGetRoomUsersEvent };
