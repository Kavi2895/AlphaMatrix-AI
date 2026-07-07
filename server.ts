import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client lazily
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using mock/fallback generation.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ============================================================================
// API ROUTES FIRST
// ============================================================================

// 1. Healthcheck endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Main Gemini prompt generator
app.post("/api/gemini/generate", async (req, res) => {
  const { prompt, systemInstruction } = req.body;
  if (!prompt) {
    res.status(400).json({ error: "Missing prompt parameter" });
    return;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    // Graceful fallback if no key is supplied
    res.json({
      reply: `[Demo Mode] High-conviction buy indicators on technology indexes with defensive hedge allocations in energy and financials. FCF expansion targets remain stable.\n\n🔬 Research Insight - Not Financial Advice`
    });
    return;
  }

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Generate Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI model" });
  }
});

// 3. Main Multi-Agent Chat endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { message, agent, history } = req.body;
  if (!message) {
    res.status(400).json({ error: "Missing message parameter" });
    return;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    // Graceful fallback for demo
    res.json({
      reply: `I have analyzed your prompt regarding portfolio exposure. In the context of ${agent || 'Sovereign Wealth'}, macro rates suggest increasing portfolio allocation toward secular yield opportunities rather than low-multiple cyclical assets.`
    });
    return;
  }

  try {
    const ai = getAIClient();
    
    // Convert history format to GenAI formats
    // [{ role: 'user' | 'model', text: '...' }] -> { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    // Instantiate Chat session
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are ${agent || 'an investment researcher'}, an elite multi-agent analyst on AlphaMatrix Research. Speak professionally, concisely, and analyze like an institutional asset manager. Always conclude with data-driven points. Keep the analysis strictly for educational research.`,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to conduct AI chat session" });
  }
});


// ============================================================================
// VITE DEV / PRODUCTION STATIC MIDDLWARE AFTER API
// ============================================================================

async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite Dev Server Middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite dev middleware successfully.");
  } else {
    // Serve Production Bundled Static Assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving production static assets from dist/ folder.");
  }

 app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
}

initializeServer().catch(err => {
  console.error("Server Initialization Failed:", err);
});
