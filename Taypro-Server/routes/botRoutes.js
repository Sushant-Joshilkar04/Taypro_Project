const express = require("express");
const { getBotLocation } = require("../controllers/botController");

const router = express.Router();

router.get("/bot-location", getBotLocation);

module.exports = router;
