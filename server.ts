import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK lazily to prevent crashing if GEMINI_API_KEY is not defined at module load
let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for Live chat mode
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array is required" });
      }

      const ai = getAi();

      const systemInstruction = `You are Fornnax Technology's export enquiry assistant. Fornnax manufactures industrial shredders and recycling plants: SR-Series primary shredders (SR-150, SR-200, SR-220, SR-200HD), R-Series secondary shredders, granulators — for tyre recycling (TDF, rubber crumb, granulate), MSW/RDF, cable, e-waste and aluminium. Your job: identify which of these fields are missing from the buyer's messages — input material, capacity (tons/month or TPH), output product, power availability, site status, timeline, budget stage — and ask for them ONE at a time, conversationally and professionally. Detect the buyer's language and reply in it. When all fields are collected, summarize the complete enquiry back and say a specialist will follow up. If the enquiry looks like a reseller/price-shopper, ask one qualifying question about their end project.`;

      const formattedHistory = messages
        .map(m => `${m.sender === 'buyer' ? 'Buyer' : 'Fornnax AI Assistant'}: ${m.text}`)
        .join('\n');

      const prompt = `Here is the current conversation history between the Buyer and the Fornnax AI Assistant:

${formattedHistory}

Determine if any of the target fields are present in the conversation history so far. Extract their values.
Target fields to extract (use string or leave blank/null if not mentioned yet):
- inputMaterial
- capacity
- outputProduct
- powerAvailability
- siteStatus
- timeline
- budgetStage

Then, formulate the next response from Fornnax AI Assistant ('reply'), asking for one missing field, or summarizing if complete.

Output your response strictly in JSON format matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: "The professional response from Fornnax AI Assistant, matching the buyer's language and asking for exactly one missing field (or summarizing if all are collected)."
              },
              extractedSpecs: {
                type: Type.OBJECT,
                properties: {
                  inputMaterial: { type: Type.STRING, description: "Details of raw inputs/tyres to process. Leave as empty string if unknown." },
                  capacity: { type: Type.STRING, description: "Throughput volume or tons/hour required. Leave as empty string if unknown." },
                  outputProduct: { type: Type.STRING, description: "Required final output size/grade (TDF, rubber crumb, etc.). Leave as empty string if unknown." },
                  powerAvailability: { type: Type.STRING, description: "Status of 3-phase power at site. Leave as empty string if unknown." },
                  siteStatus: { type: Type.STRING, description: "Land or location ready state. Leave as empty string if unknown." },
                  timeline: { type: Type.STRING, description: "Project timeline/commissioning. Leave as empty string if unknown." },
                  budgetStage: { type: Type.STRING, description: "Budget status. Leave as empty string if unknown." }
                },
                required: ["inputMaterial", "capacity", "outputProduct", "powerAvailability", "siteStatus", "timeline", "budgetStage"]
              }
            },
            required: ["reply", "extractedSpecs"]
          }
        }
      });

      const resultText = response.text || "{}";
      const resultJson = JSON.parse(resultText);

      res.json(resultJson);
    } catch (error: any) {
      console.error("Error in /api/gemini/chat:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // Vite middleware setup
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
