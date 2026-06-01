import type { GiftGenerationRequest, GiftGenerationResult } from "@/types/ai";
import { generateWithGemini, GEMINI_MODEL } from "./gemini";
import { generateWithGroq, GROQ_MODEL } from "./groq";
import { buildGiftPrompt } from "./prompts";
import { parseGiftResponse } from "./parse-response";

export async function generateGifts(
  request: GiftGenerationRequest
): Promise<GiftGenerationResult> {
  const prompt = buildGiftPrompt(request);

  // Try Gemini first
  if (process.env.GEMINI_API_KEY) {
    try {
      const raw = await generateWithGemini(prompt);
      const ideas = parseGiftResponse(raw);
      return { ideas, provider: "gemini", model: GEMINI_MODEL };
    } catch (error) {
      console.error("Gemini failed, falling back to Groq:", error);
    }
  }

  // Fallback to Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const raw = await generateWithGroq(prompt);
      const ideas = parseGiftResponse(raw);
      return { ideas, provider: "groq", model: GROQ_MODEL };
    } catch (error) {
      console.error("Groq also failed:", error);
      throw new Error("Both AI providers failed. Please try again later.");
    }
  }

  throw new Error(
    "No AI provider configured. Please set GEMINI_API_KEY or GROQ_API_KEY."
  );
}
