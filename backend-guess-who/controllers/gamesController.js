const jwt = require("jsonwebtoken");
const { pool } = require("../pool");

function createGameId(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
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
            return res.json(sessionId);
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
        } else {
          console.log(results.rows)
          return res.json(results.rows);
        }
      });
    }
  });
};

exports.deleteGame = (req, res) => {
  const sessionId = req.params.id;
  jwt.verify(req.token, process.env.JWT_SVGW_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    else {
      pool.query(
        "DELETE FROM games WHERE session_id = $1 AND creator = $2",
        [sessionId, authData.user_id],
        (err, results) => {
          if (err) {
            console.log(err);
            return res.status(400).json("Error deleting game");
          } else {
            // TO DO if results.row = 0 then means other player; => can't delete
            return res.status(200).json("Game deleted");
          }
        }
      );
    }
  });
};

exports.checkGameExist = (req, res) => {
  const id = req.params.id;
  jwt.verify(req.token, process.env.JWT_SVGW_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    else {
      pool.query("SELECT * FROM games WHERE session_id= $1", [id], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).json("Error");
        } else {
          if (results.rows.length === 0) return res.status(400).json("This game does not exist");
          else return res.status(200).json("Game exists");
        }
      });
    }
  });
};
