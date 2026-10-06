const axios = require("axios");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const FREE_MODELS = [
  "z-ai/glm-5.2:free",
  "qwen/qwen3.8-27b:free",
  "google/gemma-4-31b-it:free",
  "openrouter/free",
];

async function callAI(prompt, { json = false, temperature = 0.5 } = {}) {
  let lastError;

  for (const model of FREE_MODELS) {
    try {
      const body = {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
      };

      if (json) {
        body.response_format = { type: "json_object" };
      }

      const { data } = await axios.post(OPENROUTER_URL, body, {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "CareerFlow",
        },
        timeout: 90000,
      });

      const content = data.choices?.[0]?.message?.content;
      if (content) {
        console.log(`✅ AI responded using ${model}`);
        return content;
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message;
      console.error(`❌ Model ${model} failed:`, msg);
      lastError = err;
    }
  }

  throw lastError || new Error("All AI models failed");
}

function extractJSON(text) {
  if (!text) throw new Error("Empty AI response");
  try { return JSON.parse(text); } catch (_) {}
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) {
    throw new Error("No JSON object found");
  }
  const jsonPart = cleaned.slice(first, last + 1);
  try { return JSON.parse(jsonPart); } catch (err) {
    console.error("Failed JSON snippet:", jsonPart.slice(0, 400));
    throw new Error("Invalid JSON: " + err.message);
  }
}

async function analyzeResume(resumeText, appliedJobs = []) {
  const jobsList = appliedJobs.map((j) => `${j.company} - ${j.position}`).join(", ");

  const prompt = `Analyze this resume and reply with ONLY a JSON object. No text before it. No text after it. No markdown.

RESUME:
"""
${resumeText.slice(0, 4000)}
"""

APPLIED JOBS: ${jobsList || "None yet"}

Return exactly this JSON structure:
{
  "score": 78,
  "summary": "2-3 sentence overview",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "suggestions": ["action 1", "action 2", "action 3", "action 4"],
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "missingSkills": ["skill1", "skill2", "skill3"]
}`;

  const raw = await callAI(prompt, { json: true, temperature: 0.3 });
  return extractJSON(raw);
}

async function chatWithAI(message, userContext) {
  const prompt = `You are CareerFlow's AI Career Assistant — a friendly, concise career coach.

USER CONTEXT:
${JSON.stringify(userContext, null, 2)}

USER QUESTION: ${message}

Reply in under 200 words. Be specific and actionable.`;

  return await callAI(prompt, { temperature: 0.7 });
}

// NEW — match a resume against a specific job
async function matchResumeToJob(resumeText, job) {
  const prompt = `Compare this resume against the job and reply with ONLY a JSON object.

RESUME:
"""
${resumeText.slice(0, 3000)}
"""

JOB:
Company: ${job.company}
Position: ${job.position}
${job.location ? `Location: ${job.location}` : ""}
${job.notes ? `Notes: ${job.notes}` : ""}

Return exactly this JSON structure:
{
  "matchScore": 72,
  "matchingSkills": ["skill1", "skill2", "skill3"],
  "missingSkills": ["skill1", "skill2", "skill3"],
  "recommendation": "1-2 sentence advice on whether to pursue and what to improve"
}`;

  const raw = await callAI(prompt, { json: true, temperature: 0.3 });
  return extractJSON(raw);
}

module.exports = { analyzeResume, chatWithAI, matchResumeToJob };