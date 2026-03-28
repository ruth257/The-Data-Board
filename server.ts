import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Status Endpoint
  app.get("/api/ai/status", (req, res) => {
    const apiKey = process.env.DATA_BOARD_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
    res.json({ 
      isReady: !!apiKey,
      source: process.env.DATA_BOARD_KEY ? "Shared (Bypass)" : process.env.GEMINI_API_KEY ? "System" : process.env.API_KEY ? "Platform" : "None"
    });
  });

  // Gemini Proxy Endpoint
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { model, contents, config } = req.body;
      
      // Prioritize the custom bypass key (DATA_BOARD_KEY)
      const apiKey = process.env.DATA_BOARD_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        return res.status(401).json({ error: "No API key configured on server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents,
        config
      });

      res.json(response);
    } catch (error: any) {
      console.error("AI Proxy Error:", error);
      
      // Handle specific Google API errors
      let message = error.message || "Internal Server Error";
      if (message.includes("SERVICE_DISABLED") || message.includes("has not been used in project")) {
        message = "The 'Generative Language API' is disabled in your Google Cloud project. Please enable it in the Google Cloud Console to use the shared key.";
      } else if (message.includes("API_KEY_HTTP_REFERRER_BLOCKED")) {
        message = "Your API key has 'Website restrictions' enabled, which blocks server-side requests. Please go to Google Cloud Console and set 'Application restrictions' to 'None' for this key.";
      }
      
      res.status(500).json({ error: message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Data Board] Server running on http://localhost:${PORT}`);
    console.log(`[Data Board] Shared Key Status: ${!!(process.env.GEMINI_API_KEY || process.env.DATA_BOARD_KEY) ? "ACTIVE" : "MISSING"}`);
  });
}

startServer();
