const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobAnalytics,
  getUpcomingInterviews,
} = require("../controllers/jobController");

router.get("/analytics", protect, getJobAnalytics);
router.get("/interviews", protect, getUpcomingInterviews);

router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;