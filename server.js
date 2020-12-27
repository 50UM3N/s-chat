const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  // console.log(Object.keys(io.sockets.server.engine.clients), socket.id);
  console.log("socket connected");
  socket.on("client-send", (data) => {
    io.emit("client-podcast", data);
  });
});

server.listen(8080, (e) => {
  console.log("server listening on port 8080");
});
