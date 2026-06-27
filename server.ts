import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy initialize Gemini API client to prevent startup crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API: Chat Assistant powered by Gemini API
  app.post("/api/chat", async (req: express.Request, res: express.Response) => {
    try {
      const { message, history, context } = req.body;
      const ai = getAiClient();

      // Assemble system instruction and history
      const systemInstruction = `You are the core intelligence of DeadlineAI, an expert AI Productivity Companion. 
Your goal is to help students, professionals, and entrepreneurs hit their deadlines. 
Be proactive, analytical, and encouraging. Avoid generic answers.
Always refer to the user's actual context:
- Tasks: ${JSON.stringify(context?.tasks || [])}
- Habits: ${JSON.stringify(context?.habits || [])}
- Goals: ${JSON.stringify(context?.goals || [])}
Provide concrete action steps, schedule recommendations, and custom motivation. Avoid system-internal developer details.`;

      const contents = [
        { role: "user" as const, parts: [{ text: systemInstruction }] },
        ...(history || []).map((h: any) => ({
          role: h.role === "assistant" ? ("model" as const) : ("user" as const),
          parts: [{ text: h.content || h.text || "" }]
        })),
        { role: "user" as const, parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // API: Analyze & Prioritize Tasks + Predict Risks
  app.post("/api/analyze-tasks", async (req: express.Request, res: express.Response) => {
    try {
      const { tasks, habits } = req.body;
      if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.json({ priorities: {}, riskAnalysis: [], recommendations: [] });
      }

      const ai = getAiClient();
      const prompt = `Analyze the following tasks and habits, then calculate priority levels (Critical, High, Medium, Low) and predict deadline risks.
Tasks list: ${JSON.stringify(tasks)}
Habits list: ${JSON.stringify(habits || [])}

Provide your response in raw JSON format with the following structure:
{
  "priorities": {
    "taskId": "Critical | High | Medium | Low"
  },
  "riskAnalysis": [
    {
      "taskId": "string",
      "riskPercentage": number,
      "reason": "string describing why they might miss the deadline",
      "recommendation": "string action item",
      "recoveryPlan": "string step-by-step recovery plan"
    }
  ],
  "smartSuggestions": [
    "string suggestion 1",
    "string suggestion 2"
  ]
}
Make sure every task in the input is assigned a priority in the JSON. If a task has no deadline or is simple, set Medium or Low. If the deadline is within 24 hours, set Critical. Calculate risk percentage based on urgency, difficulty, and estimated time.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Task Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze tasks" });
    }
  });

  // API: Generate Intelligent Schedule / Adaptive Replanning
  app.post("/api/generate-schedule", async (req: express.Request, res: express.Response) => {
    try {
      const { tasks, habits, dateString } = req.body;
      const ai = getAiClient();

      const prompt = `Generate a highly structured adaptive hourly schedule for ${dateString || "today"} incorporating the following tasks and habits. Be sure to schedule appropriate breaks, focus sessions (Pomodoro), and estimated completion times.
Tasks: ${JSON.stringify(tasks || [])}
Habits: ${JSON.stringify(habits || [])}

Provide your response in raw JSON format with this structure:
{
  "timeblocks": [
    {
      "time": "e.g., 09:00 - 10:00",
      "type": "focus | break | habit | chore | flexible",
      "label": "string (e.g. Focus on Coding, Water break, React study)",
      "associatedTaskId": "string (optional task ID)",
      "description": "string detail or tip"
    }
  ],
  "estimatedCompletionTime": "string (e.g. 5.5 hours)",
  "productivityTip": "string"
}
Ensure the schedule flows logically, keeping breaks after intensive tasks and reserving high-energy periods for Critical/High tasks.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Schedule API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate schedule" });
    }
  });

  // API: Generate Flashcards from text
  app.post("/api/generate-flashcards", async (req: express.Request, res: express.Response) => {
    try {
      const { topic, content } = req.body;
      if (!content) {
        return res.status(400).json({ error: "Content is required to generate flashcards." });
      }

      const ai = getAiClient();
      const prompt = `Based on the following content about topic "${topic || "General Study"}", generate 4-6 helpful study flashcards.
Content:
${content}

Provide your response in raw JSON format with this structure:
[
  {
    "question": "string question",
    "answer": "string brief explanation or answer",
    "difficulty": "Easy | Medium | Hard"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "[]";
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Flashcards API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate flashcards" });
    }
  });

  // API: AI Daily/Weekly Review & Report Generator
  app.post("/api/generate-report", async (req: express.Request, res: express.Response) => {
    try {
      const { tasks, habits, goals, period } = req.body; // period = "daily" | "weekly"
      const ai = getAiClient();

      const prompt = `You are the DeadlineAI analytics engine. Generate a beautifully detailed productivity ${period || "weekly"} report based on these activities:
Tasks: ${JSON.stringify(tasks || [])}
Habits: ${JSON.stringify(habits || [])}
Goals: ${JSON.stringify(goals || [])}

Provide your response in raw JSON format with this structure:
{
  "productivityScore": number (out of 100),
  "summary": "string high-level summary of their achievements, focus hours, and missed deadlines",
  "strengths": ["string strength 1", "string strength 2"],
  "weaknesses": ["string weakness 1", "string weakness 2"],
  "actionPlan": ["string actionable recovery step 1", "string actionable recovery step 2"],
  "streakMessage": "string encouraging comment about their current streak and habit consistency"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Report generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  });

  // API: AI Motivation Engine & Context-Aware Reminders
  app.post("/api/generate-motivation", async (req: express.Request, res: express.Response) => {
    try {
      const { tasks, currentStreak, completedCount, totalCount } = req.body;
      const ai = getAiClient();

      const prompt = `Generate a personalized, encouraging context-aware motivational reminder message for the user.
Completed: ${completedCount || 0}/${totalCount || 0} tasks.
Current Streak: ${currentStreak || 0} days.
High Priority Tasks remaining: ${JSON.stringify((tasks || []).filter((t: any) => !t.completed))}

Provide your response in raw JSON format with this structure:
{
  "motivationText": "string bespoke motivational quote or booster",
  "smartReminder": "string context-aware reminder warning (e.g., 'You still have 65% of your project remaining. Starting now will help you finish comfortably before tomorrow's deadline!')"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Motivation API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate motivation" });
    }
  });

  // Serve static assets / handle Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
