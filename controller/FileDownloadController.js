const path = require("path");
const fs = require("fs");

async function fileDownload(req, res) {
  try {
    const { filename } = req.params;
    const ROOM_CODE = req.query.ROOM_CODE;

    const uploadsDir = path.resolve(__dirname, `../uploads/${ROOM_CODE}`);
    const filePath = path.join(uploadsDir, filename);

    // CHECK IF THE FILE EXISTS
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 404,
        message: "File does not exist 😐",
      });
    }

    // SEND THE FILE AS A RESPONSE
    res.download(filePath);
  } catch (error) {
    // EXCEPTION HANDLER
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

module.exports = { fileDownload };
