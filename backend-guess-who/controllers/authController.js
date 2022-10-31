const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../pool");

exports.userSignup = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (username == "" || email == "" || password == "" || confirmPassword == "")
  return res.status(400).json("Empty field");

  const regexPattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])");
  const checkPattern = regexPattern.test(password);
  if (!checkPattern) return res.status(400).json("Passwords special characters");

  if (password != confirmPassword) return res.status(400).json("Passwords need to match");
  else {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(400).json("There was a problem");
      else {
        pool.query(
          "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username, email, password",
          [username, email, hashedPassword],
          (err, result) => {
            if (err) {
              if (err.constraint === "users_username_key") return res.status(400).json("Username already exists")
              if (err.constraint === "users_email_key") return res.status(400).json("Email already exists")
              return res.status(400).json("Error");
            } else {
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

  pool.query("SELECT * FROM users WHERE username = $1", [username], (err, result) => {
    if (err) {

      return res.status(400).json("Error db");
    } else {
      if (result.rows.length === 0) return res.status(400).json("Incorrect username or password");
      bcrypt.compare(password, result.rows[0].password, (err, results) => {
        if (err) {
          return res.status(400).json("There was a problem");
        }
        if (!results) return res.status(400).json("Incorrect username or password");
        if (results) {
          // Log in user
          jwt.sign(result.rows[0], process.env.JWT_SVGW_TOKEN, { expiresIn: "7d" }, (err, token) => {
            if (err) return res.sendStatus(403);
            return res.status(200).json({ token: `Bearer ${token}` });
          });
        }
      });
    }
  });
};
