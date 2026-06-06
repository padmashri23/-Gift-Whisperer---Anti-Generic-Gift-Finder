import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: shared } = await supabase
    .from("shared_lists")
    .select("*")
    .eq("share_token", token)
    .eq("is_active", true)
    .single();

  if (!shared) {
    return NextResponse.json(
      { error: "Share link not found or expired" },
      { status: 404 }
    );
  }

  const { data: gifts } = await supabase
    .from("gift_ideas")
    .select("id, title, description, estimated_price_min, estimated_price_max, why_its_perfect, category, purchase_keywords")
    .in("id", shared.gift_ids);

  return NextResponse.json({
    title: shared.title,
    description: shared.description,
    recipientName: shared.recipient_name,
    occasion: shared.occasion,
    createdAt: shared.created_at,
    gifts: gifts ?? [],
  });
}
