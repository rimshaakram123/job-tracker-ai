const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { chat, matchJob } = require("../controllers/aiController");

router.post("/chat", protect, chat);
router.post("/match/:jobId", protect, matchJob);

module.exports = router;