import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  try {
    console.log("[Data Board] Starting server...");
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(cors());
    app.use(express.json());

    // Health Check
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // AI Status Endpoint
    app.get("/api/ai/status", (req, res) => {
      console.log(`[Data Board] [${new Date().toISOString()}] GET /api/ai/status`);
      const apiKey = process.env.WEBSITE_API_KEY || process.env.DATA_BOARD_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
      const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : null;
      
      res.json({ 
        isReady: !!apiKey,
        source: process.env.WEBSITE_API_KEY ? "WEBSITE_API_KEY (Secret)" : process.env.DATA_BOARD_KEY ? "DATA_BOARD_KEY (Secret)" : process.env.GEMINI_API_KEY ? "GEMINI_API_KEY (System)" : process.env.API_KEY ? "API_KEY (Platform)" : "None",
        maskedKey: maskedKey
      });
    });

    // Unified AI Proxy Endpoint
    app.post(["/api/ai/generate", "/api/ai/generate/"], async (req, res) => {
      const apiKey = process.env.WEBSITE_API_KEY || process.env.DATA_BOARD_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        console.error("[Data Board] No API key found in environment.");
        return res.status(401).json({ 
          error: "API Key Required", 
          message: "This action requires an AI connection. Please add your Gemini API key in the Vault (Settings) to continue." 
        });
      }

      const { model, contents, config } = req.body;
      const ai = new GoogleGenAI({ apiKey });
      const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;

      // Server-side retry for 503/504
      let lastError: any;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          console.log(`[Data Board] Proxying request to Gemini (Attempt ${attempt + 1}/3) using key: ${maskedKey}`);
          const response = await ai.models.generateContent({
            model: model || "gemini-3-flash-preview",
            contents,
            config
          });

          return res.json({ text: response.text || "" });
        } catch (error: any) {
          lastError = error;
          const message = error.message || "";
          const isRetryable = message.includes("503") || message.includes("504") || message.includes("UNAVAILABLE") || message.includes("high demand");
          
          if (isRetryable && attempt < 2) {
            const delay = 1000 * Math.pow(2, attempt);
            console.warn(`[Data Board] Gemini busy (503). Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          break;
        }
      }

      console.error("[Data Board] AI Proxy Error after retries:", lastError);
      let message = lastError.message || "Internal Server Error";
      let retryAfter = 0;

      // Extract retry delay from Gemini error details if available
      if (lastError.status === 429 || lastError.message?.includes("429")) {
        const retryMatch = lastError.message?.match(/retry in ([\d.]+)s/);
        if (retryMatch) {
          retryAfter = Math.ceil(parseFloat(retryMatch[1]));
        }
      }

      if (message.includes("SERVICE_DISABLED")) {
        message = "The 'Generative Language API' is disabled in your Google Cloud project.";
      } else if (message.includes("API_KEY_INVALID")) {
        message = "The API key provided is invalid. Please check your Secrets.";
      } else if (message.includes("503") || message.includes("UNAVAILABLE")) {
        message = "The AI service is currently overloaded. Please try again in a few seconds.";
      } else if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
        message = "QUOTA_EXHAUSTED: You have reached the AI service limit. This usually means your API key is on the 'Free Tier' (20 requests/day).";
      }
      
      res.status(lastError.status || 500).json({ 
        error: message,
        retryAfter: retryAfter
      });
    });

    // Catch-all for /api to diagnose 404
    app.all("/api/*", (req, res) => {
      console.warn(`[Data Board] Unhandled API request: ${req.method} ${req.url}`);
      res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
    });

    // Explicitly handle /methodology for SEO/LLMO
    app.get(["/methodology", "/methodology/"], (req, res, next) => {
      if (process.env.NODE_ENV === "production") {
        res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
      } else {
        // In dev mode, let Vite handle it, but we can also explicitly redirect to /
        // or just let the next() call hit the Vite middleware
        next();
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
    });
  } catch (error) {
    console.error("[Data Board] Server failed to start:", error);
  }
}

startServer();
