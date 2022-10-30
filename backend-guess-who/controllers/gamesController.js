const jwt = require("jsonwebtoken");
const { pool } = require("../pool");

function createGameId(length) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.createGame = (req, res) => {
  const sessionId = createGameId(20);
  jwt.verify(req.token, process.env.JWT_SVGW_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    else {
      pool.query(
        "INSERT INTO games (session_id, creator, valid) VALUES ($1, $2, $3)",
        [sessionId, authData.user_id, true],
        (err, results) => {
          if (err) {
            return res.status(400).json("error db");
          } else {
            console.log(results);
            return res.json(results.rows[0]);
          }
        }
      );
    }
  });
};

exports.retrieveActiveGames = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SVGW_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    else {
      pool.query("SELECT * FROM games WHERE creator= $1", [authData.user_id], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).json("Error");
        }
        else {
          return res.json(results.rows);
        }
      })
    }
  });
};
