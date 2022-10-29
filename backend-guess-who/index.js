const express = require("express");
const cors = require("cors");
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
app.use("/", dashboardRoute)
// auth
app.use("/", userSignupRoute);
//images
app.use("/", imagesRoute);
//games
app.use("/", gamesRoute)


const server = app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
