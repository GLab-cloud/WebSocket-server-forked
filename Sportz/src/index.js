import express from "express";
import http from "http";
import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";
const PORT = Number(process.env.PORT) || 8000;
const HOST = Number(process.env.HOST) || "0.0.0.0";
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from Express server");
});
//429 - http_code: for i in {1..60}; do curl -s -o /dev/nul -w "%{http_code}\n" http://localhost:8000/matches ; done
app.use(securityMiddleware());
app.use("/matches", matchRouter);
const { broadcastMatchCreated } = attachWebSocketServer(server);
//sharing function broadcastMatchCreated
app.locals.broadcastMatchCreated = broadcastMatchCreated;
//consider use DI or event emitter pattern for larger app
server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0"
      ? `http://localhost:${PORT}`
      : `http://localhost:${HOST}:${PORT}`;
  console.log(`Server is running on ${baseUrl}`);
  console.log(
    `WebSocket Server is running on ${baseUrl.replace("http", "ws")}/ws`
  );
});
