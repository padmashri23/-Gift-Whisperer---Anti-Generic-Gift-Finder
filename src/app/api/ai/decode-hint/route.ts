import { createClient } from "@/lib/supabase/server";
import { decodeHint } from "@/lib/ai/provider";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

// ~7M chars of base64 ≈ 5 MB per image. Cap images to keep requests sane.
const MAX_IMAGE_CHARS = 7_000_000;

const ImageSchema = z.object({
  mimeType: z
    .string()
    .regex(/^image\/(png|jpe?g|webp|gif)$/, "Unsupported image type"),
  data: z.string().min(1).max(MAX_IMAGE_CHARS, "Image is too large (max ~5 MB)"),
});

const DecodeHintRequestSchema = z
  .object({
    text: z.string().max(4000).optional(),
    images: z.array(ImageSchema).max(2).optional(),
    occasion: z.string().optional(),
  })
  .refine(
    (d) => (d.text && d.text.trim().length > 0) || (d.images && d.images.length > 0),
    { message: "Provide some text or a screenshot to decode" }
  );

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = DecodeHintRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  try {
    const result = await decodeHint({
      text: parsed.data.text,
      images: parsed.data.images,
      occasion: parsed.data.occasion,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to decode the hint";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
