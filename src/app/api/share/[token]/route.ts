import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

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
