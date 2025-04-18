const express = require("express");
const { saveCleaningStats, getLatestBotStatus } = require("../controllers/CleaningStats");

const router = express.Router();

router.post("/save", saveCleaningStats);
// router.get("/stats/:layoutId", getCleaningStats);
router.get("/status", getLatestBotStatus);

module.exports = router;
