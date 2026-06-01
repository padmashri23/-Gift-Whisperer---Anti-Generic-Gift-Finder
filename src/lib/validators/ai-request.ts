import { z } from "zod/v4";

export const GiftGenerationRequestSchema = z.object({
  description: z
    .string()
    .min(10, "Please describe the recipient in at least 10 characters")
    .max(2000, "Description is too long (max 2000 characters)"),
  occasion: z.string().optional(),
  budgetMin: z.number().min(0).max(10000).optional(),
  budgetMax: z.number().min(0).max(10000).optional(),
  recipientId: z.string().uuid().optional(),
  recipientName: z.string().optional(),
  relationship: z.string().optional(),
  interests: z.array(z.string()).optional(),
});
