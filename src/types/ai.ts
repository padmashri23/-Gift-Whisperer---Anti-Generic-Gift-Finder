export interface GiftGenerationRequest {
  description: string;
  occasion?: string;
  budgetMin?: number;
  budgetMax?: number;
  excludeGifts?: string[];
  recipientId?: string;
  recipientName?: string;
  relationship?: string;
  interests?: string[];
}

export interface GeneratedGiftIdea {
  title: string;
  description: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  whyItsPerfect: string;
  category: string;
  purchaseKeywords: string[];
}

export interface GiftGenerationResult {
  ideas: GeneratedGiftIdea[];
  provider: "gemini" | "groq";
  model: string;
}
