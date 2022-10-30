const express = require("express");
const verifyToken = require("../verifytoken");
const gameController = require("../controllers/gamesController");

const router = express.Router();

router.post("/api/games", verifyToken.verifyToken, gameController.createGame);
router.get("/api/games", verifyToken.verifyToken, gameController.retrieveActiveGames);
router.delete("/api/games/:id", verifyToken.verifyToken, gameController.deleteGame);

module.exports = router;
