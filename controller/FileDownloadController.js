const path = require("path");
const fs = require("fs");

const uploadsDir = path.resolve(__dirname, "../uploads");

async function fileDownload(req, res) {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 404,
        message: "File not found 😐",
      });
    }

    // Send the file as a response
    res.download(filePath);
  } catch (error) {
    // exception handler
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

module.exports = { fileDownload };
