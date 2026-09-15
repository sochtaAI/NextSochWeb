import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { getDatabase } from "./server/db/database";
import { authMiddleware } from "./server/middleware/auth";
import apiRouter from "./server/routes/api";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Initialize DatabaseSync, schema, indexes and seed data
  try {
    getDatabase();
    console.log("NEXT SOCH Relational Database & Services initialized successfully.");
  } catch (err) {
    console.error("Database initialization error:", err);
  }

  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(authMiddleware);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "NEXT SOCH", timestamp: new Date().toISOString() });
  });

  // REST API v1 routes: Curriculum hierarchy, question-page mappings, attempts, progress, bookmarks, mistakes, revision
  app.use("/api/v1", apiRouter);

  // AI Assistant endpoint (Server-side Gemini proxy)
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { prompt, context, type } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      // If no API key configured, provide a rich, pedagogically sound fallback response
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        let fallbackResponse = "";
        if (type === "explain_concept") {
          fallbackResponse = `### Concept Explanation: ${context?.concept || "Key Topic"}\n\n` +
            `**Core Principle:** According to NCERT Class ${context?.classLevel || "11"} ${context?.subject || "Science"}, this concept is fundamental for ${context?.exam || "NEET/JEE"}.\n\n` +
            `1. **NCERT Direct Insight:** In ${context?.chapter || "the chapter"}, page ${context?.pageNumber || "the current page"} emphasizes that biological and physical processes operate through tightly regulated molecular/physical interactions.\n` +
            `2. **Exam Focus:** NEET & JEE frequently test this via assertion-reason and statement-based questions. Pay attention to exceptional cases and direct terminology.\n` +
            `3. **Memory Hook:** Connect this with the underlying structure-function relationship.\n\n` +
            `*(Note: Add your GEMINI_API_KEY in Settings to unlock real-time streaming AI answers for any custom question!)*`;
        } else if (type === "study_plan") {
          fallbackResponse = `### Personalized ${context?.exam || "Exam"} Study Strategy\n\n` +
            `🎯 **Target:** Consistent high-yield mastery for ${context?.exam || "NEET 2025"}\n\n` +
            `- **Morning Session (2.5 hrs):** Read 6-8 NCERT pages with NEXT SOCH Smart Reader. Solve page-linked questions immediately.\n` +
            `- **Midday Session (1.5 hrs):** Review Mistake Notebook. Re-attempt questions flagged under "Concept Mistake" and "Option Confusion".\n` +
            `- **Evening Session (2 hrs):** PYQ Explorer for 2020-2024 questions on today's chapters.\n` +
            `- **Night (30 mins):** Spaced revision of due items before sleep.\n\n` +
            `💡 *Rule of thumb: Never advance a textbook page until you achieve ≥80% accuracy on its mapped questions.*`;
        } else {
          fallbackResponse = `### AI Study Mentor Insights\n\n` +
            `Regarding your question on "${prompt}":\n\n` +
            `• **NCERT Perspective:** In Indian competitive exams, precision is paramount. Ensure you memorize exact definitions and labeled diagrams.\n` +
            `• **Common Trap:** Examiners often swap keywords in Statement I and Statement II questions.\n` +
            `• **Recommended Action:** Re-read the source snippet in the Smart Reader on the left panel, then solve the 3 page-linked questions.\n\n` +
            `*(Demo Mode: To activate live Gemini 3.8 Flash analysis, set your GEMINI_API_KEY).*`;
        }

        return res.json({ text: fallbackResponse, source: "mock_intelligence" });
      }

      // Initialize Gemini SDK with server-side key
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are NEXT SOCH's elite academic tutor for Indian competitive examinations (NEET, JEE Main, JEE Advanced, and CBSE Boards).
Your answers must be:
1. Grounded strictly in authentic NCERT and syllabus concepts.
2. Direct, concise, pedagogically helpful, and encouraging.
3. Formatted with clean Markdown (bold keywords, bullet points, no fluff).
4. Highlight common examination traps and memory tricks.
Current context:
- Exam: ${context?.exam || "NEET"}
- Subject: ${context?.subject || "Biology"}
- Chapter: ${context?.chapter || "General"}
- Page: ${context?.pageNumber || "N/A"}
- Concept: ${context?.concept || "General"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nUser Question/Request: ${prompt}` }]
          }
        ],
      });

      const responseText = response.text || "No response generated.";
      res.json({ text: responseText, source: "gemini" });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({
        error: "Failed to generate AI response",
        details: error?.message || "Internal server error"
      });
    }
  });

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NEXT SOCH server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
