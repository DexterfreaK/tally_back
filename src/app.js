
// index.js creates the express server and runs it.
const path = require("path");
const express = require("express");
const app = express();


const problemRoute = require("./apis/problems/problemRoute");
const userRoute = require("./apis/user");
const compiler = require("./apis/compiler/compilerRoute");

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/problem", problemRoute);
app.use("/user",userRoute);
app.use("/compile", compiler);
module.exports = app;
