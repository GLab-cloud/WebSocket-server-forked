import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";
const matchSubscribers = new Map();

function subscribe(matchId, socket) {
  if (!matchSubscribers.has(matchId)) {
    matchSubscribers.set(matchId, new Set());
  }
  matchSubscribers.get(matchId).add(socket);
}
function unsubscribe(matchId, socket) {
  const subscribers = matchSubscribers.get(matchId);
  if (!subscribers) return;
  subscribers.delete(socket);
  if (subscribers.size === 0) {
    matchSubscribers.delete(matchId);
  }
}
function cleanupSubscriptions(socket) {
  for (const matchId of socket.subscriptions) {
    unsubscribe(matchId, socket);
  }
}
function broadcastToMatch(matchId, payload) {
  const subscribers = matchSubscribers.get(matchId);
  if (!subscribers || subscribers.size === 0) return;
  const message = JSON.stringify(payload);
  for (const client of subscribers) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}
function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}
function broadcastToAll(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    client.send(JSON.stringify(payload));
  }
}
export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    noServer: true,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });
  // wss.on("connection", async (socket, req) => {
  //   //ws arcjet
  //   if (wsArcjet) {
  //     try {
  //       const decision = await wsArcjet.protect(req);
  //       if (decision.isDenied()) {
  //         const code = decision.reason.isRateLimit() ? 1013 : 1008;
  //         const reason = decision.reason.isRateLimit()
  //           ? "Rate limit has exceeded"
  //           : "Access denied";
  //         socket.close(code, reason);
  //         return;
  //       }
  //     } catch (e) {
  //       console.error("Websocket connection error", e);
  //       socket.close(1011, "Server security error");
  //       return;
  //     }
  //   }

  // Move Arcjet protection to the HTTP upgrade event handler
  server.on("upgrade", async (req, socket, head) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    if (pathname !== "/ws") {
      return;
    }
    if (wsArcjet) {
      try {
        const decision = await wsArcjet.protect(req);
        if (decision.isDenied()) {
          if (decision.reason.isRateLimit()) {
            socket.write("HTTP/1.1 429 To Many Requests\r\n\r\n");
          } else {
            socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
          }
          socket.destroy();
          return;
        }
      } catch (e) {
        console.error("WebSocket upgrade protection error", e);
        socket.write("HTTP/1.1 500 Internal Server Eror\r\n\r\n");
        socket.destroy();
        return;
      }
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
      ws.isAlive = true;
      ws.on("pong", () => {
        ws.isAlive = true;
      });
      sendJson(ws, { type: "welcome" });
      ws.on("error", console.error);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
  wss.on("close", () => clearInterval(interval));

  function broadcastMatchCreated(match) {
    broadcastToAll(wss, { type: "match_created", data: match });
  }
  //sharing function broadcastMatchCreated
  return { broadcastMatchCreated };
}
