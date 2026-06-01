import { z } from "zod/v4";

export const GiftUpdateSchema = z.object({
  is_saved: z.boolean().optional(),
  is_given: z.boolean().optional(),
  given_date: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});
