import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  try {
    console.log("[Data Board] Starting server...");
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());

    const apiRouter = express.Router();

    // Health Check
    apiRouter.get("/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // AI Status Endpoint
    apiRouter.get("/ai/status", (req, res) => {
      console.log(`[Data Board] [${new Date().toISOString()}] GET /api/ai/status`);
      const apiKey = process.env.DATA_BOARD_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
      res.json({ 
        isReady: !!apiKey,
        source: process.env.DATA_BOARD_KEY ? "Shared (Bypass)" : process.env.GEMINI_API_KEY ? "System" : process.env.API_KEY ? "Platform" : "None"
      });
    });

    // Gemini Proxy Endpoint
    apiRouter.post("/ai/generate", async (req, res) => {
      console.log("[Data Board] POST /api/ai/generate");
      try {
        const { model, contents, config } = req.body;
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
        let message = error.message || "Internal Server Error";
        if (message.includes("SERVICE_DISABLED") || message.includes("has not been used in project")) {
          message = "The 'Generative Language API' is disabled in your Google Cloud project.";
        } else if (message.includes("API_KEY_HTTP_REFERRER_BLOCKED")) {
          message = "Your API key has 'Website restrictions' enabled.";
        }
        res.status(500).json({ error: message });
      }
    });

    app.use("/api", apiRouter);

    // Global Request Logger
    app.use((req, res, next) => {
      console.log(`[Data Board] [${new Date().toISOString()}] ${req.method} ${req.protocol}://${req.hostname}${req.url} (IP: ${req.ip}, IPs: ${JSON.stringify(req.ips)}, Subdomains: ${JSON.stringify(req.subdomains)}, Path: ${req.path}, BaseUrl: ${req.baseUrl}, OriginalUrl: ${req.originalUrl}, Query: ${JSON.stringify(req.query)}, Body: ${JSON.stringify(req.body)}, Cookies: ${JSON.stringify(req.cookies)}, Params: ${JSON.stringify(req.params)}, XHR: ${req.xhr}, Secure: ${req.secure}, Stale: ${req.stale}, Fresh: ${req.fresh}, Route: ${JSON.stringify(req.route)}, App: ${req.app ? "EXISTS" : "MISSING"}, Res: ${res ? "EXISTS" : "MISSING"})`);
      console.log(`[Data Board] Headers: ${JSON.stringify(req.headers)}`);
      next();
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
      console.log(`[Data Board] DATA_BOARD_KEY: ${process.env.DATA_BOARD_KEY ? "PRESENT" : "MISSING"}`);
      console.log(`[Data Board] GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "PRESENT" : "MISSING"}`);
      console.log(`[Data Board] API_KEY: ${process.env.API_KEY ? "PRESENT" : "MISSING"}`);
    });
  } catch (error) {
    console.error("[Data Board] Server failed to start:", error);
  }
}

startServer();
