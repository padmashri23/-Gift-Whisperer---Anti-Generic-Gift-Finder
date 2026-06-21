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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await genai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.9,
        maxOutputTokens: 2048,
        abortSignal: controller.signal,
      },
    });
    return response.text ?? "";
  } finally {
    clearTimeout(timeout);
  }
}

export interface InlineImage {
  mimeType: string;
  /** Base64-encoded image data (no data: URL prefix). */
  data: string;
}

/**
 * Multimodal Gemini call: a text prompt plus optional inline images.
 * Used for decoding gift "hints" from a pasted screenshot.
 */
export async function generateWithGeminiVision(
  prompt: string,
  images: InlineImage[]
): Promise<string> {
  const genai = getClient();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  const parts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [{ text: prompt }];
  for (const img of images) {
    parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
  }

  try {
    const response = await genai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 1024,
        abortSignal: controller.signal,
      },
    });
    return response.text ?? "";
  } finally {
    clearTimeout(timeout);
  }
}
