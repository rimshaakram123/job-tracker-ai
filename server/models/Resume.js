const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    extractedText: { type: String, default: "" },
    aiAnalysis: {
      score: { type: Number, default: 0 },
      summary: { type: String, default: "" },
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      skills: [String],
      missingSkills: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);