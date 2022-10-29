const express = require("express");
const getImages = require("../controllers/imagesController")


const router = express.Router();

router.get("/api/images/:id", getImages.getImages)

module.exports = router;
