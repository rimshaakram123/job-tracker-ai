const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      userId: req.user._id,
      company: req.body.company,
      position: req.body.position,
      location: req.body.location,
      salary: req.body.salary,
      status: req.body.status,
      applicationDate: req.body.applicationDate,
      notes: req.body.notes,
      interviewDate: req.body.interviewDate,
      interviewTime: req.body.interviewTime,
      interviewType: req.body.interviewType,
      interviewNotes: req.body.interviewNotes,
      prepChecklist: req.body.prepChecklist || [],
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobAnalytics = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id });

    const analytics = {
      total: jobs.length,
      Applied: jobs.filter((j) => j.status === "Applied").length,
      Interview: jobs.filter((j) => j.status === "Interview").length,
      "Technical Interview": jobs.filter((j) => j.status === "Technical Interview").length,
      Offer: jobs.filter((j) => j.status === "Offer").length,
      Accepted: jobs.filter((j) => j.status === "Accepted").length,
      Rejected: jobs.filter((j) => j.status === "Rejected").length,
      Withdrawn: jobs.filter((j) => j.status === "Withdrawn").length,
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW — upcoming & past interviews
const getUpcomingInterviews = async (req, res) => {
  try {
    const now = new Date();

    const upcoming = await Job.find({
      userId: req.user._id,
      interviewDate: { $gte: now },
    }).sort({ interviewDate: 1 });

    const past = await Job.find({
      userId: req.user._id,
      interviewDate: { $lt: now, $ne: null },
    }).sort({ interviewDate: -1 });

    res.json({ upcoming, past });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobAnalytics,
  getUpcomingInterviews,
};