const jwt = require("jsonwebtoken");

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
  const gameId = createGameId(20);
  jwt.verify(req.token, process.env.JWT_SVGW_TOKEN, (err, result) => {
    if (err) return res.sendStatus(403);
    else {
      return res.json(gameId);
    }
  });
};
