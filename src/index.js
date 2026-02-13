const express = require("express");
const enableWs = require("express-ws");

const app = express();
const wsinstance = enableWs(app);

app.ws("/", (ws, req) => {
  console.log("connected", req.query);

  // Validate the auth token
  if (req.query.token === "bhasker") {
    // when we recieve refresh token
    ws.on("message", (msg) => {
      let obj = JSON.parse(msg);
      if (obj.type === "refreshToken") {
        // this is temp, in real scenario will be using JWT
        if (obj.data.indexOf("xyz") === -1) {
          ws.close();
        } else {
          console.log("connection is valid");
          ws.token = obj.data;
        }
      }
    });

    setInterval(() => {
      console.log("current token", ws.token);
      // First test if jwt is valid...
      // jwt.verify(ws.token,(err,decoded)=>{
      wsinstance.getWss().clients.forEach((c) => {
        c.send("hello");
      });
      //})
    }, 20000);

    ws.on("close", () => {
      console.log("WebSocket was closed");
    });
  } else {
    ws.close();
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.listen(8080);
