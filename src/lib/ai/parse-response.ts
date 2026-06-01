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

  const parsed = JSON.parse(cleaned);
  const data = Array.isArray(parsed)
    ? parsed
    : parsed.ideas ?? parsed.gifts ?? parsed.results ?? [];

  return GiftIdeasArraySchema.parse(data);
}
