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

app.use(cors({ origin: FRONTEND }));

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
    origin: FRONTEND,
  },
});

const MAXNUMBERPLAYER = 4;
io.on("connection", (socket) => {
  let tmpId;
  socket.on("join", (id) => {
    tmpId = id;
    socket.join(id);
    const roomSize = io.sockets.adapter.rooms.get(id).size;

    if (roomSize > MAXNUMBERPLAYER) {
      let roomIsFull = true;
      io.emit("fullRoom" + id, roomIsFull);
      return;
    }

    io.emit("numberPlayers", roomSize);
  });

  socket.on("discard", ({ name, sessionId, username, isCancelled }) => {
    io.emit("discardPlayer", { name, sessionId, username, isCancelled });
  });

  socket.on("disconnect", () => {
    let room = io.sockets.adapter.rooms.get(tmpId);
    if (room === undefined) return;
    const roomSize = room.size;
    io.emit("numberPlayers", roomSize);
  })
});


server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
