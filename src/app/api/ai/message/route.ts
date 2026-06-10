import { createClient } from "@/lib/supabase/server";
import { generateGiftMessage } from "@/lib/ai/provider";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const MessageRequestSchema = z.object({
  giftTitle: z.string(),
  recipientDescription: z.string(),
  whyItsPerfect: z.string(),
  tone: z.enum(["heartfelt", "funny", "casual", "formal"]).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = MessageRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const message = await generateGiftMessage(parsed.data);
    return NextResponse.json({ message });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to generate message";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
