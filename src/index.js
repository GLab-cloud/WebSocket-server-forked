// import { WebSocketServer, WebSocket } from "ws";
const express = require("express");
const enableWs = require("express-ws");
const WebSocket = require("ws");

const app = express();
const wsinstance = enableWs(app);

app.listen(8080);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// const wss = new WebSocketServer({ port: 8081 });

// app.ws("/", (ws, req) => {
//   console.log("connected", req.query);

//   // Validate the auth token
//   if (req.query.token === "bhasker") {
//     // when we recieve refresh token
//     ws.on("message", (msg) => {
//       let obj = JSON.parse(msg);
//       if (obj.type === "refreshToken") {
//         // this is temp, in real scenario will be using JWT
//         if (obj.data.indexOf("xyz") === -1) {
//           ws.close();
//         } else {
//           console.log("connection is valid");
//           ws.token = obj.data;
//         }
//       }
//     });

//     setInterval(() => {
//       console.log("current token", ws.token);
//       // First test if jwt is valid...
//       // jwt.verify(ws.token,(err,decoded)=>{
//       wsinstance.getWss().clients.forEach((c) => {
//         c.send("hello");
//       });
//       //})
//     }, 20000);

//     ws.on("close", () => {
//       console.log("WebSocket was connected");
//     });
//   } else {
//     //ws.close();
//   }
// });

//connection event
//0:connecting
//1:open (the only state where you can safely .send())
//2: closing
//3: closed
app.ws("/", (ws, req) => {
  const ip = req.socket.remoteAddress;
  ws.on("message", (rawData) => {
    const message = rawData.toString();
    console.log({ rawData });
    // Access the central WebSocket server instance
    wsinstance.getWss().clients.forEach((client) => {
      // Check if the client is currently open before sending the message
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          `Server Broadcast message: ${message} to remote IP Address: ${ip}`
        );
      }
    });
  });
  ws.on("error", (err) => {
    console.error(`Error : ${err.message}: ${ip}`);
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
//npm i --save-dev @types/node @types/ws
console.log("WebSocket Server is live on ws://whl9dn-8080.csb.app");
// testing -> wscat -c ws://localhost:8080
