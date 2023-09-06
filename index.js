require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const checkHealthRoute = require("./routes/CheckHealthRoute");
const fileDownloadRoute = require("./routes/FileDownloadRoute");
const { connectSocket } = require("./socket/ConnectSocket");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 7000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

// ROUTES
app.use(checkHealthRoute);
app.use(fileDownloadRoute);

// SERVER STARTED
server.listen(port, (error) => {
  if (!error) {
    console.log(`Server Listening on Port ${port}`);
  } else {
    console.log(`Error Occured : ${error}`);
  }
});

// SOCKET INITIALIZED
connectSocket(server);
