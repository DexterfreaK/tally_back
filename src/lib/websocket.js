// lib/websocket.js
const WebSocket = require('ws');

let wss;

const initWebSocketServer = (server) => {
  if (!wss) {
    wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
      console.log('New client connected');

      ws.on('message', (message) => {
        console.log(`Received: ${message}`);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
};

const broadcastLeaderboardUpdate = (leaderboardId, update) => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ leaderboardId, update }));
      }
    });
  }
};

module.exports = {
  initWebSocketServer,
  broadcastLeaderboardUpdate,
};
