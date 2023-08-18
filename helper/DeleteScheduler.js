const path = require("path");
const { deleteDirectory } = require("../helper/DeleteDirectory");

function getSubfolderPath(roomCode) {
  const subfolderPath = path.join(__dirname, `../uploads/${roomCode}`);
  return subfolderPath;
}

// Function to schedule deletion after 2 hours
function deleteScheduler(data) {
  const subfolderPath = getSubfolderPath(data.ROOM_CODE);

  const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  setTimeout(() => {
    deleteDirectory(subfolderPath);
  }, twoHours);
}

module.exports = { deleteScheduler };
