const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const { analyzeResume } = require("../utils/ai");

async function extractText(filePath, mimetype) {
  if (mimetype === "application/pdf") {
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || "";
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  throw new Error("Unsupported file type. Use PDF or DOCX.");
}

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const text = await extractText(filePath, req.file.mimetype);
    fs.unlinkSync(filePath);

    if (!text || text.length < 50) {
      return res.status(400).json({ message: "Could not read text from resume" });
    }

    const jobs = await Job.find({ userId: req.user._id }).select("company position");

    let aiAnalysis = {};
    try {
      aiAnalysis = await analyzeResume(text, jobs);
    } catch (err) {
      console.error("AI analysis error:", err.message);
      aiAnalysis = {
        score: 0,
        summary: "AI analysis temporarily unavailable.",
        strengths: [],
        weaknesses: [],
        suggestions: ["Please try uploading again in a moment."],
        skills: [],
        missingSkills: [],
      };
    }

    await Resume.deleteMany({ userId: req.user._id });

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      extractedText: text.slice(0, 20000),
      aiAnalysis,
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(resume || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    await Resume.deleteMany({ userId: req.user._id });
    res.json({ message: "Resume deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, getResume, deleteResume };