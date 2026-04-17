import express from "express";
import http from "http";
import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";
const PORT = Number(process.env.PORT) || 8000;
const HOST = Number(process.env.HOST) || "0.0.0.0";
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from Express server");
});
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
