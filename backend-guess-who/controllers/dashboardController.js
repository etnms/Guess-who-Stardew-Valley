const jwt = require("jsonwebtoken");

exports.checkUserLogin = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SVGW_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    else return res.json(authData.username);
  });
};
