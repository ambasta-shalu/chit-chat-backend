const fs = require("fs");
const path = require("path");

// Delete a directory and its contents recursively
function deleteDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        deleteDirectory(filePath); // Recursive call for subdirectories
      } else {
        fs.unlinkSync(filePath); // Delete file
      }
    }

    fs.rmdirSync(directoryPath); // Delete empty directory
  }
}

module.exports = { deleteDirectory };
