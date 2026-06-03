import { createClient } from "@/lib/supabase/server";
import { generateGifts } from "@/lib/ai/provider";
import { GiftGenerationRequestSchema } from "@/lib/validators/ai-request";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = GiftGenerationRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }

  let excludeGifts: string[] = [];
  if (parsed.data.recipientId) {
    const { data: sessions } = await supabase
      .from("gift_sessions")
      .select("id")
      .eq("recipient_id", parsed.data.recipientId);

    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map((s) => s.id);
      const { data: pastGifts } = await supabase
        .from("gift_ideas")
        .select("title")
        .in("session_id", sessionIds)
        .eq("is_given", true);

      excludeGifts = pastGifts?.map((g) => g.title) ?? [];
    }
  }

  const { data: allGivenGifts } = await supabase
    .from("gift_ideas")
    .select("title, category")
    .eq("user_id", user.id)
    .eq("is_given", true);

  const previouslyGiven = allGivenGifts?.map((g) => g.title.toLowerCase()) ?? [];

  try {
    const result = await generateGifts({
      ...parsed.data,
      excludeGifts,
    });

    const { data: session } = await supabase
      .from("gift_sessions")
      .insert({
        user_id: user.id,
        recipient_id: parsed.data.recipientId ?? null,
        description_input: parsed.data.description,
        occasion: parsed.data.occasion ?? null,
        budget_min: parsed.data.budgetMin ?? null,
        budget_max: parsed.data.budgetMax ?? null,
        ai_provider: result.provider,
        ai_model: result.model,
      })
      .select()
      .single();

    if (session) {
      const { data: savedIdeas } = await supabase
        .from("gift_ideas")
        .insert(
          result.ideas.map((idea) => ({
            session_id: session.id,
            user_id: user.id,
            title: idea.title,
            description: idea.description,
            estimated_price_min: idea.estimatedPriceMin,
            estimated_price_max: idea.estimatedPriceMax,
            why_its_perfect: idea.whyItsPerfect,
            category: idea.category,
            purchase_keywords: idea.purchaseKeywords,
          }))
        )
        .select();

      const ideasWithAlerts = savedIdeas?.map((idea) => {
        const isDuplicate = previouslyGiven.some(
          (given) =>
            given === idea.title.toLowerCase() ||
            idea.title.toLowerCase().includes(given) ||
            given.includes(idea.title.toLowerCase())
        );
        return { ...idea, regift_warning: isDuplicate };
      });

      return NextResponse.json({ session, ideas: ideasWithAlerts });
    }

    return NextResponse.json({
      session: null,
      ideas: result.ideas,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate gifts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
