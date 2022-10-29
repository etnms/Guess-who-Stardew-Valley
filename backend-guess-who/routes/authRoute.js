const express = require("express");
const auth = require("../controllers/authController")

const router = express.Router();

router.post("/api/auth/signup", auth.userSignup)
router.post("/api/auth/login", auth.userLogin)

module.exports = router;
