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

    // Global Request Logger (Move to top for debugging)
    app.use((req, res, next) => {
      console.log(`[Data Board] [${new Date().toISOString()}] ${req.method} ${req.url}`);
      if (req.method === "POST") {
        console.log(`[Data Board] Body keys: ${Object.keys(req.body || {})}`);
      }
      next();
    });

    // Health Check
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // AI Status Endpoint
    app.get("/api/ai/status", (req, res) => {
      console.log(`[Data Board] [${new Date().toISOString()}] GET /api/ai/status`);
      const apiKey = process.env.DATA_BOARD_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
      const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : null;
      
      res.json({ 
        isReady: !!apiKey,
        source: process.env.DATA_BOARD_KEY ? "DATA_BOARD_KEY (Secret)" : process.env.GEMINI_API_KEY ? "GEMINI_API_KEY (System)" : process.env.API_KEY ? "API_KEY (Platform)" : "None",
        maskedKey: maskedKey
      });
    });

    // Unified AI Proxy Endpoint
    app.all(["/api/ai/generate", "/api/ai/generate/"], async (req, res) => {
      console.log(`[Data Board] [${new Date().toISOString()}] ${req.method} ${req.url}`);
      
      // Handle CORS Preflight
      if (req.method === "OPTIONS") {
        return res.status(204).end();
      }

      if (req.method !== "POST") {
        console.warn(`[Data Board] Method ${req.method} not allowed for /api/ai/generate`);
        return res.status(405).json({ 
          error: "Method Not Allowed", 
          message: `Please use POST instead of ${req.method}. If you are seeing this, your browser might be converting a POST to a GET due to a redirect.`,
          url: req.url,
          method: req.method
        });
      }

      try {
        const { model, contents, config } = req.body;
        const apiKey = process.env.DATA_BOARD_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
        
        if (!apiKey) {
          console.error("[Data Board] No API key found in environment.");
          return res.status(401).json({ error: "No API key configured on server. Please check your Secrets." });
        }

        const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
        console.log(`[Data Board] Proxying request to Gemini using key: ${maskedKey}`);

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: model || "gemini-3-flash-preview",
          contents,
          config
        });

        res.json({ text: response.text || "" });
      } catch (error: any) {
        console.error("[Data Board] AI Proxy Error:", error);
        let message = error.message || "Internal Server Error";
        if (message.includes("SERVICE_DISABLED")) {
          message = "The 'Generative Language API' is disabled in your Google Cloud project.";
        } else if (message.includes("API_KEY_INVALID")) {
          message = "The API key provided is invalid. Please check your Secrets.";
        }
        res.status(error.status || 500).json({ error: message });
      }
    });

    // Catch-all for /api to diagnose 404
    app.all("/api/*", (req, res) => {
      console.warn(`[Data Board] Unhandled API request: ${req.method} ${req.url}`);
      res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
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
      const dbKey = process.env.DATA_BOARD_KEY;
      const geminiKey = process.env.GEMINI_API_KEY;
      const apiKey = process.env.API_KEY;
      
      console.log(`[Data Board] DATA_BOARD_KEY: ${dbKey ? `${dbKey.substring(0, 4)}...${dbKey.substring(dbKey.length - 4)}` : "MISSING"}`);
      console.log(`[Data Board] GEMINI_API_KEY: ${geminiKey ? `${geminiKey.substring(0, 4)}...${geminiKey.substring(geminiKey.length - 4)}` : "MISSING"}`);
      console.log(`[Data Board] API_KEY: ${apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "MISSING"}`);
    });
  } catch (error) {
    console.error("[Data Board] Server failed to start:", error);
  }
}

startServer();
