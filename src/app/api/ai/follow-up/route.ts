import { createClient } from "@/lib/supabase/server";
import { generateFollowUpQuestions } from "@/lib/ai/provider";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const FollowUpRequestSchema = z.object({
  description: z.string().min(10).max(2000),
  occasion: z.string().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = FollowUpRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const questions = await generateFollowUpQuestions(
      parsed.data.description,
      parsed.data.occasion
    );
    return NextResponse.json({ questions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
