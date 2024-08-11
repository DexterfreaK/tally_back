
// index.js creates the express server and runs it.
const path = require("path");
const express = require("express");
const app = express();


const problemRoute = require("./apis/problems/problemRoute");
const compiler = require("./apis/compiler/compilerRoute");
const contest = require("./apis/contest/contestRoute");
const rateLimit = require("express-rate-limit");

app.use(express.json());

const rateLimiters = new Map();
const windowMs = 15 * 60 * 1000; // 15 minutes window
const maxRequests = 100;

app.use((req, res, next) => {
  const ip = req.ip; 
  const currentTime = Date.now(); 
  let limiter = rateLimiters.get(ip);

  if (!limiter) {
    limiter = {
      count: 1, // Start the count at 1
      startTime: currentTime,
    };
  } else {
    if (currentTime - limiter.startTime < windowMs) {
      if (limiter.count >= maxRequests) {
        return res
          .status(429)
          .send("Too many requests, please try again later.");
      }
      limiter.count += 1;
    } else {
      limiter.count = 1;
      limiter.startTime = currentTime;
    }
  }

  rateLimiters.set(ip, limiter); // Update the map with the new data
  next(); // Proceed to the next middleware/route handler
});


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
app.use("/compile", compiler);
app.use("/contest", contest);
module.exports = app;
