import type { GiftGenerationRequest, GiftGenerationResult } from "@/types/ai";
import {
  generateWithGemini,
  generateWithGeminiVision,
  GEMINI_MODEL,
  type InlineImage,
} from "./gemini";
import { generateWithGroq, GROQ_MODEL } from "./groq";
import {
  buildGiftPrompt,
  buildFollowUpPrompt,
  buildMessagePrompt,
  buildDecodeHintPrompt,
} from "./prompts";
import { parseGiftResponse } from "./parse-response";

function stripJsonFences(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*\n?/m, "")
    .replace(/\n?```\s*$/m, "")
    .trim();
}

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

export interface DecodedHint {
  description: string;
  signals: string[];
  interests: string[];
}

export async function decodeHint(input: {
  text?: string;
  images?: InlineImage[];
  occasion?: string;
}): Promise<DecodedHint> {
  const hasImage = !!input.images && input.images.length > 0;
  const prompt = buildDecodeHintPrompt({
    text: input.text,
    hasImage,
    occasion: input.occasion,
  });

  let raw: string;
  if (hasImage) {
    // Images require a multimodal model — only Gemini supports this here.
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "Screenshot decoding needs the Gemini provider. Please remove the image or try text only."
      );
    }
    raw = await generateWithGeminiVision(prompt, input.images!);
  } else {
    raw = await callAI(prompt);
  }

  const cleaned = stripJsonFences(raw);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!objMatch) {
      throw new Error("Could not decode the hint. Please try again.");
    }
    parsed = JSON.parse(objMatch[0]);
  }

  const description =
    typeof parsed.description === "string" ? parsed.description.trim() : "";
  if (!description) {
    throw new Error("Could not decode a description from this hint.");
  }

  const signals = Array.isArray(parsed.signals)
    ? parsed.signals.filter((s): s is string => typeof s === "string")
    : [];
  const interests = Array.isArray(parsed.interests)
    ? parsed.interests.filter((s): s is string => typeof s === "string")
    : [];

  return { description, signals, interests };
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
