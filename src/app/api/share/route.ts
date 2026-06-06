import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const CreateShareSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  giftIds: z.array(z.string().uuid()).min(1).max(20),
  recipientName: z.string().max(100).optional(),
  occasion: z.string().max(100).optional(),
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
  const parsed = CreateShareSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { data: gifts } = await supabase
    .from("gift_ideas")
    .select("id")
    .eq("user_id", user.id)
    .in("id", parsed.data.giftIds);

  if (!gifts || gifts.length === 0) {
    return NextResponse.json({ error: "No valid gifts found" }, { status: 400 });
  }

  const validIds = gifts.map((g) => g.id);

  const { data: shared, error } = await supabase
    .from("shared_lists")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      gift_ids: validIds,
      recipient_name: parsed.data.recipientName ?? null,
      occasion: parsed.data.occasion ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }

  return NextResponse.json({ shared }, { status: 201 });
}
