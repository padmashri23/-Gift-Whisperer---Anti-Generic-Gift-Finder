import type { GiftGenerationRequest, GiftGenerationResult } from "@/types/ai";
import { generateWithGemini, GEMINI_MODEL } from "./gemini";
import { generateWithGroq, GROQ_MODEL } from "./groq";
import { buildGiftPrompt, buildFollowUpPrompt, buildMessagePrompt } from "./prompts";
import { parseGiftResponse } from "./parse-response";

async function callAI(prompt: string): Promise<string> {
  if (process.env.GEMINI_API_KEY) {
    try {
      return await generateWithGemini(prompt);
    } catch (error) {
      console.error("Gemini failed, falling back to Groq:", error);
    }
  }

  if (process.env.GROQ_API_KEY) {
    try {
      return await generateWithGroq(prompt);
    } catch (error) {
      console.error("Groq also failed:", error);
      throw new Error("Both AI providers failed. Please try again later.");
    }
  }

  throw new Error(
    "No AI provider configured. Please set GEMINI_API_KEY or GROQ_API_KEY."
  );
}

export async function generateGifts(
  request: GiftGenerationRequest
): Promise<GiftGenerationResult> {
  const prompt = buildGiftPrompt(request);

  if (process.env.GEMINI_API_KEY) {
    try {
      const raw = await generateWithGemini(prompt);
      const ideas = parseGiftResponse(raw);
      return { ideas, provider: "gemini", model: GEMINI_MODEL };
    } catch (error) {
      console.error("Gemini failed, falling back to Groq:", error);
    }
  }

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

export async function generateFollowUpQuestions(
  description: string,
  occasion?: string
): Promise<{ question: string; options: string[] }[]> {
  const prompt = buildFollowUpPrompt(description, occasion);
  const raw = await callAI(prompt);

  const cleaned = raw
    .replace(/^```(?:json)?\s*\n?/m, "")
    .replace(/\n?```\s*$/m, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      parsed = JSON.parse(arrayMatch[0]);
    } else {
      throw new Error("AI returned invalid format for questions.");
    }
  }

  const questions = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>).questions ?? [];

  return (questions as { question: string; options: string[] }[]).slice(0, 3);
}

export async function generateGiftMessage(input: {
  giftTitle: string;
  recipientDescription: string;
  whyItsPerfect: string;
  tone?: string;
}): Promise<string> {
  const prompt = buildMessagePrompt(input);
  const raw = await callAI(prompt);

  const cleaned = raw
    .replace(/^```(?:json)?\s*\n?/m, "")
    .replace(/\n?```\s*$/m, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed.message || parsed.note || parsed.card || cleaned;
  } catch {
    return cleaned;
  }
}
