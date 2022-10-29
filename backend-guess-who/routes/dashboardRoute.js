const express = require("express");
const verifyToken = require("../verifytoken");
const dashboard = require("../controllers/dashboardController");

const router = express.Router();

router.get("/api/dashboard", verifyToken.verifyToken, dashboard.checkUserLogin)

module.exports = router;
