const express = require("express");

// CREATING EXPRESS ROUTE HANDLER
const router = express.Router();

router.get("/health", (req, res) => {
  res.send(`Server is Healthy 💚 `);
});

module.exports = router;
