import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK with safeguard
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables. Please set it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", time: new Date().toISOString() });
  });

  // 1. Travel Itinerary Generator with Gemini API in JSON format
  app.post("/api/gemini/itinerary", async (req, res) => {
    try {
      const { city, style, days } = req.body;
      const ai = getGeminiClient();

      const numDays = Math.min(Math.max(Number(days) || 1, 1), 7);
      const targetCity = city || "Seoul";
      const travelStyle = style || "balance";

      const prompt = `Create a detailed and authentic, highly exciting travel itinerary for ${numDays} days in ${targetCity}, South Korea, tailored for an traveler with a style focused on '${travelStyle}'. 
Provide descriptions in Russian. Structure the response precisely as a JSON array of daily descriptions. Each day object must contain:
1. "day": (integer, starting from 1)
2. "theme": (brief daily topic phrase in Russian, e.g. "Величественные дворцы и современная классика")
3. "activities": array of 3-4 structured activities. Each activity object must contain:
   - "title": (string, Russian title of activity, e.g. "Посещение дворца Кёнбоккун")
   - "koreanTitle": (string, Korean original name, e.g. "경복궁")
   - "time": (string, general timing like "09:30 - 11:30" or "18:00")
   - "description": (detailed string in Russian giving guidance on what to see, do, or taste)
   - "tip": (important insider tip in Russian, e.g. "Возьмите напрокат ханбок для бесплатного входа")
   - "emoji": (a fitting Unicode emoji for this activity)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                theme: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      koreanTitle: { type: Type.STRING },
                      time: { type: Type.STRING },
                      description: { type: Type.STRING },
                      tip: { type: Type.STRING },
                      emoji: { type: Type.STRING }
                    },
                    required: ["title", "koreanTitle", "time", "description", "tip", "emoji"]
                  }
                }
              },
              required: ["day", "theme", "activities"]
            }
          }
        }
      });

      if (!response.text) {
        throw new Error("No response content generated from Gemini API");
      }

      const itinerary = JSON.parse(response.text.trim());
      res.json({ success: true, itinerary });
    } catch (error: any) {
      console.error("Itinerary Generation Error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Не удалось сгенерировать маршрут. Проверьте настройки ключа API." 
      });
    }
  });

  // 2. Custom Korean Name Generator
  app.post("/api/gemini/generate-name", async (req, res) => {
    try {
      const { gender, season, traits, originalName } = req.body;
      const ai = getGeminiClient();

      const userTraits = Array.isArray(traits) ? traits.join(", ") : traits || "умный, креативный";
      const userGender = gender || "unspecified";
      const birthSeason = season || "весна";

      const prompt = `Generate a beautiful, authentic South Korean name (Hanja + Hangul) for a person named "${originalName || 'User'}".
Their characteristics are: ${userTraits}.
Their gender is: ${userGender}.
Their birth season is: ${birthSeason}.
Provide a response in Russian. Return the results in JSON format according to the schema.
Ensure the name is highly natural to modern Korean ears, with beautiful, layered meanings. Explain the Hanja meaning in Russian.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              koreanNameHangul: { type: Type.STRING, description: "Korean characters e.g. 지호" },
              koreanNameRomanized: { type: Type.STRING, description: "Romanized spelling e.g. Ji-ho" },
              hanja: { type: Type.STRING, description: "Traditional Chinese/Hanja characters e.g. 智浩" },
              hanjaMeaning: { type: Type.STRING, description: "Literal meaning of each character in Russian" },
              overallMeaning: { type: Type.STRING, description: "Russian description of the name profile and why it matches traits/season" },
              accentTips: { type: Type.STRING, description: "Brief advice on correct pronunciation" }
            },
            required: ["koreanNameHangul", "koreanNameRomanized", "hanja", "hanjaMeaning", "overallMeaning", "accentTips"]
          }
        }
      });

      if (!response.text) {
        throw new Error("No response content generated for Name Generator");
      }

      const result = JSON.parse(response.text.trim());
      res.json({ success: true, nameResult: result });
    } catch (error: any) {
      console.error("Name Generation Error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Не удалось сгенерировать имя. Проверьте настройки ключа API." 
      });
    }
  });

  // 3. Cultural Chat / Assistant
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const ai = getGeminiClient();

      const chatMessages = (history || []).map((msg: any) => ({
        role: msg.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: msg.content }]
      }));

      // Append current message
      chatMessages.push({
        role: "user" as const,
        parts: [{ text: message }]
      });

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are a warm, highly knowledgeable, friendly Korean Culture, Language and Travel expert. The user is a Russian speaker interested in exploring, visiting, or learning about South Korea. Talk in Russian (fluent, welcoming, and elegant tone). Use accurate Korean terms, explain local etiquettes, historical background, provide correct grammar or translation info if asked. Keep replies structured and engaging.",
        }
      });

      // Simple implementation using chats or models.generateContent for single message stream/completion
      // We will perform generateContent with full context to bypass any session state serialization
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatMessages,
      });

      res.json({ success: true, responseText: response.text });
    } catch (error: any) {
      console.error("Culture Chat Error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Не удалось отправить сообщение. Попробуйте еще раз." 
      });
    }
  });

  // Serve static assets / HMR integration with Vite
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
    console.log(`[Discover Korea Portal] Server is running in ${process.env.NODE_ENV === "production" ? "production" : "development"} mode on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
