const express = require("express");
const verifyToken = require("../verifytoken");
const gameController = require("../controllers/gamesController");

const router = express.Router();

router.get("/api/games", verifyToken.verifyToken, gameController.createGame)

module.exports = router;
