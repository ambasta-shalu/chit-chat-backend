const express = require("express");
const { fileDownload } = require("../controller/FileDownloadController");

// CREATING EXPRESS ROUTE HANDLER
const router = express.Router();

router.get("/download/:filename", fileDownload);

module.exports = router;
