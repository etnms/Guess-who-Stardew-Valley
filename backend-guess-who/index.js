const express = require("express");
const cors = require("cors");
const imagesRoute = require("./routes/imagesRoute");
const userSignupRoute = require("./routes/authRoute")

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 8000;
const FRONTEND = process.env.FRONTEND || "http://localhost:3000";

app.use(
  express.json({
    type: "*/*",
  })
);
app.use(cors({ origin: FRONTEND }));

app.use("/", imagesRoute);
app.use("/", userSignupRoute);

app.get("/", (req, res) => {
  res.send("hi");
});

const server = app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
