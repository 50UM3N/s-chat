const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

var users = {};

app.use(express.static("public"));
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("index.ejs", { roomId: req.query.room });
});
const checkName = (req, res, next) => {
  if (req.query.name == undefined) {
    return res.redirect(`/?room=${req.params.id}`);
  }
  return next();
};
app.post("/create-room", (req, res) => {
  res.redirect(`/${uuidV4()}?name=${req.body.name}`);
});

app.get("/:id", checkName, (req, res) => {
  res.render("chat.ejs", { roomId: req.params.id, name: req.query.name });
});

app.post("/join-room", (req, res) => {
  res.redirect(`/${req.body.room_id}?name=${req.body.name}`);
});

io.on("connection", (socket) => {
  // console.log(Object.keys(io.sockets.server.engine.clients), socket.id);
  console.log("socket connected");
  socket.on("join-room", (roomId, name) => {
    users[`${socket.id}`] = name;

    socket.on("disconnecting", () => {
      socket.to(roomId).emit("user-disconnected", users[socket.id]);
      delete users[`${socket.id}`];
      console.log("disconnecting: " + socket.id);
    });

    socket.to(roomId).emit("user-connect", name);

    console.log("Room join");

    socket.join(roomId);

    socket.on("client-send", (data, name) => {
      socket.to(roomId).emit("client-podcast", data, name);
    });
  });
});

server.listen(8080, (e) => {
  console.log("server listening on port 8080");
});
