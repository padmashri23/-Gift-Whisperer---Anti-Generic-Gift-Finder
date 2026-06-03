import { z } from "zod/v4";

const GiftIdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedPriceMin: z.number(),
  estimatedPriceMax: z.number(),
  whyItsPerfect: z.string(),
  category: z.string(),
  purchaseKeywords: z.array(z.string()),
});

const GiftIdeasArraySchema = z.array(GiftIdeaSchema);

export type ParsedGiftIdea = z.infer<typeof GiftIdeaSchema>;

export function parseGiftResponse(raw: string): ParsedGiftIdea[] {
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
      throw new Error("AI returned invalid JSON. Please try again.");
    }
  }

  const data = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>).ideas ??
      (parsed as Record<string, unknown>).gifts ??
      (parsed as Record<string, unknown>).results ??
      [];

  const validated = GiftIdeasArraySchema.safeParse(data);
  if (!validated.success) {
    throw new Error("AI returned unexpected format. Please try again.");
  }
  return validated.data;
}
