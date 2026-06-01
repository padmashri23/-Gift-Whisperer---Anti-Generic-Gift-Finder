import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return client;
}

export const GEMINI_MODEL = "gemini-2.5-flash";

export async function generateWithGemini(prompt: string): Promise<string> {
  const genai = getClient();
  const response = await genai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.9,
      maxOutputTokens: 4096,
    },
  });
  return response.text ?? "";
}
