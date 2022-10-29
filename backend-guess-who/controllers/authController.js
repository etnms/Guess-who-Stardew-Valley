const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../pool");

exports.userSignup = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password != confirmPassword) return res.status(400).json("Passwords need to match");
  if (username == "" || email == "" || password == "" || confirmPassword == "")
    return res.status(400).json("Empty field");
  else {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(400).json("There was a problem");
      else {
        pool.query(
          "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
          [username, email, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(400).json("Error");
            } else {
              console.log(result);
              // Log in user
              jwt.sign(result.rows[0], process.env.JWT_SVGW_TOKEN, { expiresIn: "7d" }, (err, token) => {
                if (err) return res.sendStatus(403);
                return res.status(200).json({ token: `Bearer ${token}`, message: "User created" });
              });
            }
          }
        );
      }
    });
  }
};

exports.userLogin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json("Empty fields");
  }

  pool.query(`SELECT * FROM users WHERE username = $1`, [username], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json("Error db");
    } else {
      bcrypt.compare(password, result.rows[0].password, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).json("There was a problem");
        }
        if (!results) return res.status(400).json("Incorrect username or password");
        if (results) {
          // Log in user
          jwt.sign(result.rows[0], process.env.JWT_SVGW_TOKEN, { expiresIn: "7d" }, (err, token) => {
            if (err) return res.status(400).json("Incorrect username or password");
            return res.status(200).json({ token: `Bearer ${token}` });
          });
        }
      });
    }
  });
};
