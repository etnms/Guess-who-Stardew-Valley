const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const dashboardRoute = require("./routes/dashboardRoute");
const userSignupRoute = require("./routes/authRoute");
const imagesRoute = require("./routes/imagesRoute");
const gamesRoute = require("./routes/gamesRoute");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND = process.env.FRONTEND || "http://localhost:3000";

app.use(
  express.json({
    type: "*/*",
  })
);

app.use(cors({ origin: "http://localhost:3000" }));

// dashboard
app.use("/", dashboardRoute);
// auth
app.use("/", userSignupRoute);
//images
app.use("/", imagesRoute);
//games
app.use("/", gamesRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("socket id is" + socket.id)

  socket.on("join", (id) => {
    socket.join(id);
    const roomSize = io.sockets.adapter.rooms.get(id).size;
    //console.log( io.sockets.adapter.rooms.get(id).size)
    socket.emit("numberPlayers", roomSize);
  })

  socket.on("discard", ({name, sessionId, username}) => {

    console.log(name, sessionId, username);
    io.emit("discardPlayer", ({name, sessionId, username}))
  })

  /*
  socket.on("connect", () => {
    console.log("client connected")
    //socket.join(args);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");

  })
  */
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));