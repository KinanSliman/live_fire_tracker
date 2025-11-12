import { WebSocket, WebSocketServer } from "ws";
const PORT = 5000;

export const start_ws_server = () => {
  const wss = new WebSocketServer({ port: `${PORT}` });
  wss.on("connection", (ws) => {
    console.log("connected to web socket server");
  });

  wss.on("listening", () => {
    console.log(`🔥 WebSocket server running on port ${PORT}`);
  });

  wss.on("error", (error) => {
    console.error("❌ WebSocket server error:", error);
  });
};
