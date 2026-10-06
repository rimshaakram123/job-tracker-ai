const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String, default: "" },
    salary: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "Applied",
        "Interview",
        "Technical Interview",
        "Offer",
        "Accepted",
        "Rejected",
        "Withdrawn",
      ],
      default: "Applied",
    },
    applicationDate: { type: Date, default: Date.now },
    notes: { type: String, default: "" },

    // Interview fields
    interviewDate: { type: Date, default: null },
    interviewTime: { type: String, default: "" },
    interviewType: {
      type: String,
      enum: ["", "Phone Screen", "Technical", "Behavioral", "HR", "Final Round", "Other"],
      default: "",
    },
    interviewNotes: { type: String, default: "" },
    prepChecklist: [
      {
        task: { type: String, required: true },
        done: { type: Boolean, default: false },
      },
    ],

    // Resume match fields
    matchScore: { type: Number, default: null },
    matchingSkills: [String],
    missingSkills: [String],
    recommendation: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);