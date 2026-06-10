import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user;

  const { searchParams } = new URL(request.url);
  const recipientId = searchParams.get("recipientId");
  const savedOnly = searchParams.get("saved") === "true";
  const givenOnly = searchParams.get("given") === "true";

  let query = supabase
    .from("gift_ideas")
    .select("*, gift_sessions(recipient_id, occasion, description_input)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (savedOnly) {
    query = query.eq("is_saved", true);
  }

  if (givenOnly) {
    query = query.eq("is_given", true);
  }

  if (recipientId) {
    query = query.eq("gift_sessions.recipient_id", recipientId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
