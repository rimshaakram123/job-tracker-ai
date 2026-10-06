const { chatWithAI, matchResumeToJob } = require("../utils/ai");
const Job = require("../models/Job");
const Resume = require("../models/Resume");

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });

    const jobs = await Job.find({ userId: req.user._id });
    const resume = await Resume.findOne({ userId: req.user._id });

    const context = {
      userName: req.user.name,
      totalApplications: jobs.length,
      interviews: jobs.filter((j) =>
        ["Interview", "Technical Interview", "Offer", "Accepted"].includes(j.status)
      ).length,
      offers: jobs.filter((j) => ["Offer", "Accepted"].includes(j.status)).length,
      recentApplications: jobs.slice(0, 5).map((j) => ({
        company: j.company,
        position: j.position,
        status: j.status,
      })),
      hasResume: !!resume,
      resumeScore: resume?.aiAnalysis?.score || 0,
      topSkills: resume?.aiAnalysis?.skills?.slice(0, 5) || [],
    };

    const reply = await chatWithAI(message, context);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// NEW — match resume against a job
const matchJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      userId: req.user._id,
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume || !resume.extractedText) {
      return res.status(400).json({
        message: "Upload a resume first to see job matching",
      });
    }

    const match = await matchResumeToJob(resume.extractedText, job);

    // Save it on the job so we don't re-run every time
    job.matchScore = match.matchScore;
    job.matchingSkills = match.matchingSkills || [];
    job.missingSkills = match.missingSkills || [];
    job.recommendation = match.recommendation || "";
    await job.save();

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chat, matchJob };