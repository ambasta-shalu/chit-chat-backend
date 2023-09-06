const fs = require("fs");
const path = require("path");

// HANDLE FILE UPLOAD AND SAVE IT WITH A UNIQUE NAME
function fileUpload(data) {
  const fileBuffer = data.CONTENT;

  // CREATING A UNIQUE FILENAME BASED ON CURRENT TIME AND THE ORIGINAL FILENAME
  const uniqueFileName = `${Date.now()}-${data.CONTENT_NAME}`;

  const uploadsDir = path.join(__dirname, `../uploads/${data.ROOM_CODE}`);

  // if (!fs.existsSync(uploadsDir)) {
  //   fs.mkdirSync(uploadsDir);
  // }

  try {
    fs.mkdirSync(uploadsDir, { recursive: true }); // CREATE DIRECTORIES RECURSIVELY
  } catch (error) {
    console.error("Error creating directories:", error);
    return; // RETURN OR HANDLE THE ERROR APPROPRIATELY
  }

  const filePath = path.join(uploadsDir, uniqueFileName);
  fs.writeFileSync(filePath, fileBuffer);

  // APPEND THE UNIQUE FILENAME TO THE DATA OBJECT
  data.UNIQUE_NAME = uniqueFileName;
}

module.exports = { fileUpload };
