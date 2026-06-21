import { z } from "zod/v4";

export const EVENT_TYPES = [
  "birthday",
  "anniversary",
  "occasion",
  "reminder",
  "note",
] as const;

export const CalendarEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title is too long"),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  event_type: z.enum(EVENT_TYPES).default("occasion"),
  notes: z.string().max(1000, "Notes are too long").optional().nullable(),
  is_recurring: z.boolean().default(false),
});

export const CalendarEventUpdateSchema = CalendarEventSchema.partial();
