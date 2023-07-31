const express = require("express");
const { fileDownload } = require("../controller/FileDownloadController");

// creating express route handler
const router = express.Router();

router.get("/download/:filename", fileDownload);

module.exports = router;
