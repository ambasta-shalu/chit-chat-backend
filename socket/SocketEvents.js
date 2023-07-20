function onJoinRoomEvent(data, socket, io) {
  if (data.IS_NEW_ROOM) {
    // user join in new room
    socket.join(data.ROOM_CODE);
    socket.data.USER_NAME = data.USER_NAME; // Save the USER_NAME in socket.data
    socket.data.USER_ID = data.USER_ID; // Save the USER_ID in socket.data

    socket.emit("toastEvent", `Welcome to Chit Chat ${data.USER_NAME} !`);
  } else {
    // user join in existing room
    // check if ROOM_CODE exists
    const roomExists =
      io.of("/").adapter.rooms && io.of("/").adapter.rooms.has(data.ROOM_CODE);

    if (roomExists) {
      socket.join(data.ROOM_CODE);
      socket.data.USER_NAME = data.USER_NAME; // Save the USER_NAME in socket.data
      socket.data.USER_ID = data.USER_ID; // Save the USER_ID in socket.data
      socket
        .to(data.ROOM_CODE)
        .emit("toastEvent", `${data.USER_NAME} has Joined the Room`);

      const roomUsers = onGetRoomUsersEvent(data, io);
      socket.to(data.ROOM_CODE).emit("receiveRoomUsersEvent", roomUsers);

      socket.emit("toastEvent", `Welcome to Chit Chat ${data.USER_NAME} !`);
    } else {
      socket.emit(
        "errorEvent",
        `Landed NOWHERE! No ${data.ROOM_CODE} found 😑`
      );
    }
  }
}

function onGetRoomUsersEvent(data, io) {
  const room = io.sockets.adapter.rooms.get(data.ROOM_CODE);
  if (room) {
    const users = [];
    room.forEach((socketId) => {
      const socket = io.sockets.sockets.get(socketId);
      if (
        socket &&
        socket.data &&
        socket.data.USER_NAME &&
        socket.data.USER_ID
      ) {
        users.push([socket.data.USER_NAME, socket.data.USER_ID]);
      }
    });
    return users;
  }
  return [];
}

module.exports = { onJoinRoomEvent, onGetRoomUsersEvent };
