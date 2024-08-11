const { initWebSocketServer } = require("./lib/websocket.js");

const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 3001;
const app = require("./app");

initWebSocketServer(app);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
