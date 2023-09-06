const path = require("path");
const { deleteDirectory } = require("../helper/DeleteDirectory");

function getSubfolderPath(roomCode) {
  const subfolderPath = path.join(__dirname, `../uploads/${roomCode}`);
  return subfolderPath;
}

// FUNCTION TO SCHEDULE DELETION AFTER 2 HOURS
function deleteScheduler(data) {
  const subfolderPath = getSubfolderPath(data.ROOM_CODE);

  const twoHours = 2 * 60 * 60 * 1000; // 2 HOURS IN MILLISECONDS

  setTimeout(() => {
    deleteDirectory(subfolderPath);
  }, twoHours);
}

module.exports = { deleteScheduler };
