const fs = require("fs");
const path = require("path");

// Handle file upload and save it with a unique name
function fileUpload(data) {
  const fileBuffer = data.CONTENT;

  // Creating a unique filename based on current time and the original filename
  const uniqueFileName = `${Date.now()}-${data.CONTENT_NAME}`;

  const uploadsDir = path.join(__dirname, `../uploads/${data.ROOM_CODE}`);

  // if (!fs.existsSync(uploadsDir)) {
  //   fs.mkdirSync(uploadsDir);
  // }

  try {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Create directories recursively
  } catch (error) {
    console.error("Error creating directories:", error);
    return; // Return or handle the error appropriately
  }

  const filePath = path.join(uploadsDir, uniqueFileName);
  fs.writeFileSync(filePath, fileBuffer);

  // Append the unique filename to the data object
  data.UNIQUE_NAME = uniqueFileName;
}

module.exports = { fileUpload };
