const socket = io("/");
const name = prompt("Enter your name");
socket.on("connect", () => {
  console.log("socket connected");
});

const send = (data) => {
  socket.emit("client-send", data);
};

socket.on("client-podcast", (data) => {
  console.log(data);
});
