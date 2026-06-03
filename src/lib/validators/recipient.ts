import { z } from "zod/v4";

export const RecipientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  relationship: z.string().max(50).optional(),
  description: z.string().max(2000).optional(),
  interests: z.array(z.string().max(50)).max(20).optional(),
  important_dates: z
    .array(
      z.object({
        label: z.string().max(50),
        date: z.string(),
      })
    )
    .max(10)
    .optional(),
  notes: z.string().max(2000).optional(),
  avatar_url: z.string().url().optional(),
});
