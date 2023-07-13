require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const checkHealthRoute = require("./routes/CheckHealthRoute");
const { connectSocket } = require("./socket/ConnectSocket");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 7000;

// middleware
app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

// routes
app.use(checkHealthRoute);

// server started
server.listen(port, (error) => {
  if (!error) {
    console.log(`Server Listening on Port ${port} `);
  } else {
    console.log(`Error Occured : ${error}`);
  }
});

// socket initialized
connectSocket(server);