import { createClient } from "@/lib/supabase/server";
import { generateWithGroq } from "@/lib/ai/groq";
import { generateWithGemini } from "@/lib/ai/gemini";
import { NextResponse } from "next/server";

const trendingPrompt = (occasion: string, ageGroup: string) =>
  `You are a gift trends expert for the Indian market. Suggest 6 trending and popular gift ideas for the following:

Occasion: ${occasion}
Age Group: ${ageGroup}
Market: India (prices in INR)

For each gift, provide:
- A specific product name (not generic)
- A brief description
- Estimated price in INR
- Category (one of: experience, handmade, tech, book, subscription, food-drink, home, fashion, hobby-gear, novelty)
- Search keywords for Indian e-commerce sites
- Why it's trending right now

Respond ONLY with a JSON object with a "gifts" key containing an array. No markdown, no code fences.
Each object: {"title": "...", "description": "...", "estimatedPrice": number, "category": "...", "keywords": ["..."], "whyTrending": "..."}`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { occasion, ageGroup } = body;

  if (!occasion || !ageGroup) {
    return NextResponse.json(
      { error: "Occasion and age group are required" },
      { status: 400 }
    );
  }

  const prompt = trendingPrompt(occasion, ageGroup);

  let raw = "";

  if (process.env.GEMINI_API_KEY) {
    try {
      raw = await generateWithGemini(prompt);
    } catch {
      console.error("Gemini failed for trending, trying Groq");
    }
  }

  if (!raw && process.env.GROQ_API_KEY) {
    try {
      raw = await generateWithGroq(prompt);
    } catch {
      return NextResponse.json(
        { error: "AI providers unavailable" },
        { status: 503 }
      );
    }
  }

  if (!raw) {
    return NextResponse.json(
      { error: "No AI provider available" },
      { status: 503 }
    );
  }

  try {
    let cleaned = raw.trim();
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) cleaned = fenceMatch[1].trim();

    const parsed = JSON.parse(cleaned);
    const gifts = parsed.gifts || parsed;

    return NextResponse.json({ gifts: Array.isArray(gifts) ? gifts : [] });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response" },
      { status: 500 }
    );
  }
}
