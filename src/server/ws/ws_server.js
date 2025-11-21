import { WebSocket, WebSocketServer } from "ws";
const PORT = 5000;

let wss;
let totalData = [];
let lastUpdateTime = null; // Add this

export const start_ws_server = (dataRef, updateTimeRef) => {
  wss = new WebSocketServer({
    port: PORT,
    perMessageDeflate: false,
  });

  if (dataRef) {
    totalData = dataRef;
  }

  if (updateTimeRef) {
    lastUpdateTime = updateTimeRef;
  }

  wss.on("connection", (ws, req) => {
    console.log("✅ New client connected to WebSocket server");
    console.log(`📊 Total clients connected: ${wss.clients.size}`);

    // Send current data to newly connected client
    if (totalData && totalData.length > 0) {
      const message = JSON.stringify({
        type: "INITIAL_DATA",
        data: totalData,
        count: totalData.length,
        lastUpdateTime: lastUpdateTime, // Include last update time
        timestamp: new Date().toISOString(),
      });

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        console.log(
          `📤 Sent initial data (${totalData.length} records) to new client`
        );
      }
    }

    // Handle messages from clients
    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        console.log(`📨 Received message type: ${parsedMessage.type}`);

        switch (parsedMessage.type) {
          case "REQUEST_ALL_DATA":
            const response = JSON.stringify({
              type: "ALL_DATA",
              data: totalData,
              count: totalData.length,
              lastUpdateTime: lastUpdateTime, // Include last update time
              timestamp: new Date().toISOString(),
            });
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(response);
            }
            break;

          case "REQUEST_DATA_COUNT":
            const countResponse = JSON.stringify({
              type: "DATA_COUNT",
              count: totalData.length,
              lastUpdateTime: lastUpdateTime, // Include last update time
              timestamp: new Date().toISOString(),
            });
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(countResponse);
            }
            break;

          case "REQUEST_LAST_UPDATE": // New message type for last update time
            const updateResponse = JSON.stringify({
              type: "LAST_UPDATE_TIME",
              lastUpdateTime: lastUpdateTime,
              timestamp: new Date().toISOString(),
            });
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(updateResponse);
            }
            break;

          case "PING":
            const pongResponse = JSON.stringify({
              type: "PONG",
              lastUpdateTime: lastUpdateTime, // Include last update time
              timestamp: new Date().toISOString(),
            });
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(pongResponse);
            }
            break;
        }
      } catch (error) {
        console.error("❌ Error processing client message:", error);
        const errorResponse = JSON.stringify({
          type: "ERROR",
          message: "Invalid message format",
        });
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(errorResponse);
        }
      }
    });

    ws.on("close", (code, reason) => {
      console.log(`❌ Client disconnected. Code: ${code}, Reason: ${reason}`);
      console.log(`📊 Remaining clients: ${wss.clients.size}`);
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket client error:", error);
    });
  });

  wss.on("listening", () => {
    console.log(`🔥 WebSocket server running on ws://localhost:${PORT}`);
  });

  wss.on("error", (error) => {
    console.error("❌ WebSocket server error:", error);
  });
};

// Function to broadcast data updates to all connected clients
export const broadcastDataUpdate = () => {
  if (!wss || !totalData) {
    console.log("❌ Cannot broadcast: WebSocket server or data not available");
    return;
  }

  const message = JSON.stringify({
    type: "DATA_UPDATED",
    data: totalData,
    count: totalData.length,
    lastUpdateTime: lastUpdateTime, // Include last update time
    timestamp: new Date().toISOString(),
  });

  let sentCount = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      sentCount++;
    }
  });

  console.log(`📢 Broadcasted data update to ${sentCount} clients`);
  console.log(`🕒 Last update time: ${lastUpdateTime}`);
};

// Function to update the data reference and last update time
export const updateDataReference = (newData, updateTime) => {
  totalData = newData;
  lastUpdateTime = updateTime;
  console.log(`📝 Updated data reference with ${newData.length} records`);
  console.log(`🕒 Last update time set to: ${lastUpdateTime}`);
};
