const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");
const WebSocket = require("ws");

const port = process.env.PORT || 3001;
const app = require("./app");

// Set up PostgreSQL client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to fetch leaderboard data
async function getLeaderboardData() {
  try {
    const res = await pool.query(`
      SELECT 
        le.entry_id, 
        le.leaderboard_id, 
        le.user_id, 
        le.score, 
        le.last_updated,
        u.username, 
        u.email, 
        u.name, 
        u.bio, 
        u.profile_picture_url, 
        u.created_at
      FROM 
        public.leaderboard_entries le
      JOIN 
        public.users u 
      ON 
        le.user_id = u.user_id;
    `);
    return res.rows;
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    return [];
  }
}

// Set up WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send leaderboard data every 1 second
  const intervalId = setInterval(async () => {
    const data = await getLeaderboardData();
    ws.send(JSON.stringify(data));
  }, 3000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });
});

// Integrate WebSocket with Express server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
