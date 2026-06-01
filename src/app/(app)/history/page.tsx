"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatPriceRange } from "@/lib/utils";
import { Clock, Star, Package } from "lucide-react";
import { toast } from "sonner";

interface GiftHistoryItem {
  id: string;
  title: string;
  description: string;
  estimated_price_min: number;
  estimated_price_max: number;
  why_its_perfect: string;
  category: string;
  is_given: boolean;
  given_date: string | null;
  rating: number | null;
  created_at: string;
  gift_sessions: {
    recipient_id: string | null;
    occasion: string | null;
    description_input: string;
  } | null;
}

export default function HistoryPage() {
  const [gifts, setGifts] = useState<GiftHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "given" | "saved">("all");

  useEffect(() => {
    async function load() {
      const params = new URLSearchParams();
      if (filter === "given") params.set("given", "true");
      if (filter === "saved") params.set("saved", "true");

      const res = await fetch(`/api/gifts?${params}`);
      if (res.ok) setGifts(await res.json());
      setLoading(false);
    }
    load();
  }, [filter]);

  async function rateGift(giftId: string, rating: number) {
    const res = await fetch(`/api/gifts/${giftId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    if (res.ok) {
      setGifts(
        gifts.map((g) => (g.id === giftId ? { ...g, rating } : g))
      );
      toast.success("Rating saved!");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Gift History</h1>
        <p className="text-text-secondary mt-1">
          Track gifts you&apos;ve given and ideas you&apos;ve saved
        </p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(["all", "given", "saved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
              filter === f
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {f === "all" ? "All Ideas" : f === "given" ? "Given" : "Saved"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-24" />
          ))}
        </div>
      ) : gifts.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No gift history yet"
          description="Start finding gifts and your history will appear here."
          actionLabel="Find a Gift"
          actionHref="/find"
        />
      ) : (
        <div className="space-y-3">
          {gifts.map((gift) => (
            <Card key={gift.id} padding="sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-text-primary">
                      {gift.title}
                    </h3>
                    {gift.is_given && (
                      <span className="inline-flex items-center gap-1 text-xs text-success bg-green-50 px-2 py-0.5 rounded-full">
                        <Package className="h-3 w-3" />
                        Given
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {gift.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
                    <span className="text-primary-600 font-medium">
                      {formatPriceRange(
                        gift.estimated_price_min,
                        gift.estimated_price_max
                      )}
                    </span>
                    {gift.gift_sessions?.occasion && (
                      <span>{gift.gift_sessions.occasion}</span>
                    )}
                    {gift.given_date && <span>Given {gift.given_date}</span>}
                  </div>

                  {gift.is_given && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-text-tertiary mr-1">
                        Rate:
                      </span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => rateGift(gift.id, star)}
                          className="p-0.5"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              gift.rating && star <= gift.rating
                                ? "fill-warning text-warning"
                                : "text-border-strong"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Badge category={gift.category}>{gift.category}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
