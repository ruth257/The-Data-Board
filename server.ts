import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { toGeminiSchema } from "./src/services/aiService";

dotenv.config();

// API_KEY mirrors how Google AI Studio's Build environment injects its own
// key (Gemini-only) - kept separate from the Claude-oriented shared secrets.
const resolveServerKey = (provider: string) =>
  provider === "gemini"
    ? process.env.GEMINI_API_KEY || process.env.API_KEY
    : process.env.WEBSITE_API_KEY || process.env.DATA_BOARD_KEY || process.env.ANTHROPIC_API_KEY;

async function startServer() {
  try {
    console.log("[Data Board] Starting server...");
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(cors());
    app.use(express.json());

    // Request Logging for Diagnostics
    app.use((req, res, next) => {
      if (!req.url.startsWith('/@') && !req.url.startsWith('/src/') && !req.url.startsWith('/node_modules/')) {
        console.log(`[Data Board] ${new Date().toISOString()} ${req.method} ${req.url}`);
      }
      next();
    });

    // Health Check
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // AI Status Endpoint
    app.get("/api/ai/status", (req, res) => {
      const provider = req.query.provider === "gemini" ? "gemini" : "claude";
      console.log(`[Data Board] [${new Date().toISOString()}] GET /api/ai/status?provider=${provider}`);
      const apiKey = resolveServerKey(provider);
      const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : null;

      const source = provider === "gemini"
        ? (process.env.GEMINI_API_KEY ? "GEMINI_API_KEY (System)" : process.env.API_KEY ? "API_KEY (Platform)" : "None")
        : (process.env.WEBSITE_API_KEY ? "WEBSITE_API_KEY (Secret)" : process.env.DATA_BOARD_KEY ? "DATA_BOARD_KEY (Secret)" : process.env.ANTHROPIC_API_KEY ? "ANTHROPIC_API_KEY (System)" : "None");

      res.json({ isReady: !!apiKey, source, maskedKey });
    });

    // Unified AI Proxy Endpoint
    app.post(["/api/ai/generate", "/api/ai/generate/"], async (req, res) => {
      const provider = req.body.provider === "gemini" ? "gemini" : "claude";
      const apiKey = resolveServerKey(provider);

      if (!apiKey) {
        console.error(`[Data Board] No ${provider} API key found in environment.`);
        return res.status(401).json({
          error: "API Key Required",
          message: `This action requires an AI connection. Please add your ${provider === "gemini" ? "Gemini" : "Claude"} API key in the Vault (Settings) to continue.`
        });
      }

      const { prompt, tool } = req.body;
      const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;

      // Server-side retry for overloaded/rate-limited responses
      let lastError: any;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          console.log(`[Data Board] Proxying request to ${provider} (Attempt ${attempt + 1}/3) using key: ${maskedKey}`);

          if (provider === "gemini") {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt,
              config: { responseMimeType: "application/json", responseSchema: toGeminiSchema(tool.schema) },
            });
            let cleaned = (response.text || "{}").trim();
            if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```json\n?/, "").replace(/\n?```$/, "");
            return res.json({ result: JSON.parse(cleaned) });
          }

          const anthropic = new Anthropic({ apiKey });
          const response = await anthropic.messages.create({
            model: "claude-sonnet-5",
            max_tokens: 8192,
            messages: [{ role: "user", content: prompt }],
            tools: [{ name: tool.name, description: "Return the structured result for this task.", input_schema: tool.schema }],
            tool_choice: { type: "tool", name: tool.name },
          });
          const block = response.content.find((b: any) => b.type === "tool_use" && b.name === tool.name) as any;
          if (!block) {
            return res.status(502).json({ error: "Claude did not return a structured response." });
          }
          return res.json({ result: block.input });
        } catch (error: any) {
          lastError = error;
          const status = error.status;
          const message = error.message || "";
          const isRetryable = status === 529 || message.includes("529") || message.includes("503") || message.includes("UNAVAILABLE") || message.includes("overloaded") || message.includes("high demand");

          if (isRetryable && attempt < 2) {
            const delay = 1000 * Math.pow(2, attempt);
            console.warn(`[Data Board] ${provider} overloaded. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          break;
        }
      }

      console.error("[Data Board] AI Proxy Error after retries:", lastError);
      let message = lastError.message || "Internal Server Error";
      let retryAfter = 0;

      if (lastError.status === 429 || message.includes("429") || message.includes("rate_limit") || message.includes("RESOURCE_EXHAUSTED")) {
        const retryMatch = message.match(/retry.*?([\d.]+)\s*s/);
        if (retryMatch) {
          retryAfter = Math.ceil(parseFloat(retryMatch[1]));
        }
      }

      if (message.includes("authentication_error") || message.includes("invalid x-api-key") || message.includes("API_KEY_INVALID")) {
        message = "The API key provided is invalid. Please check your Secrets.";
      } else if (lastError.status === 529 || message.includes("overloaded") || message.includes("UNAVAILABLE")) {
        message = "The AI service is currently overloaded. Please try again in a few seconds.";
      } else if (lastError.status === 429 || message.includes("rate_limit") || message.includes("RESOURCE_EXHAUSTED")) {
        message = "QUOTA_EXHAUSTED: You have reached the AI service limit.";
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

    // SPA Routing & Static Files
    const distPath = path.join(process.cwd(), 'dist');
    const isProduction = fs.existsSync(distPath);
    let vite: any;

    if (!isProduction) {
      console.log("[Data Board] Running in DEVELOPMENT mode (dist folder not found)");
      vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
    } else {
      console.log("[Data Board] Running in PRODUCTION mode (dist folder found)");
    }

    // Explicitly handle /methodology and root to ensure they always serve index.html
    const serveIndex = async (req: any, res: any, next: any) => {
      try {
        if (isProduction) {
          res.sendFile(path.join(distPath, 'index.html'));
        } else {
          let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(req.url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        }
      } catch (e) {
        next(e);
      }
    };

    app.get(['/', '/methodology', '/methodology/'], serveIndex);

    if (isProduction) {
      app.use(express.static(distPath));
    } else {
      app.use(vite.middlewares);
    }

    // Catch-all SPA fallback for any other routes
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) return next();
      if (url.includes('.')) return next(); // Skip files
      
      serveIndex(req, res, next);
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Data Board] Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[Data Board] Server failed to start:", error);
  }
}

startServer();
