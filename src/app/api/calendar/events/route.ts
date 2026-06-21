import { createClient } from "@/lib/supabase/server";
import { CalendarEventSchema } from "@/lib/validators/calendar-event";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", session.user.id)
    .order("event_date");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CalendarEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      user_id: session.user.id,
      title: parsed.data.title,
      event_date: parsed.data.event_date,
      event_type: parsed.data.event_type,
      notes: parsed.data.notes ?? null,
      is_recurring: parsed.data.is_recurring,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
