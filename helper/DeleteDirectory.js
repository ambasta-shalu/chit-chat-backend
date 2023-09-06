const fs = require("fs");
const path = require("path");

// DELETE A DIRECTORY AND ITS CONTENTS RECURSIVELY
function deleteDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        deleteDirectory(filePath); // RECURSIVE CALL FOR SUBDIRECTORIES
      } else {
        fs.unlinkSync(filePath); // DELETE FILE
      }
    }

    fs.rmdirSync(directoryPath); // DELETE EMPTY DIRECTORY
  }
}

module.exports = { deleteDirectory };
