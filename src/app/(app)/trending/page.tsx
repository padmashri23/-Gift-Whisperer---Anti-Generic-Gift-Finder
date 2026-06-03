"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Sparkles,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface TrendingGift {
  title: string;
  description: string;
  estimatedPrice: number;
  category: string;
  keywords: string[];
  whyTrending: string;
}

const occasions = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Diwali",
  "Christmas",
  "Valentine's Day",
  "Housewarming",
  "Baby Shower",
  "Graduation",
  "Rakhi",
];

const ageGroups = [
  "Teen (13-19)",
  "Young Adult (20-30)",
  "Adult (31-45)",
  "Middle-aged (46-60)",
  "Senior (60+)",
];

export default function TrendingPage() {
  const [occasion, setOccasion] = useState("Birthday");
  const [ageGroup, setAgeGroup] = useState("Young Adult (20-30)");
  const [results, setResults] = useState<TrendingGift[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchTrending() {
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/ai/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, ageGroup }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch trending gifts");
      }

      setResults(data.gifts || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function openStore(keywords: string[], store: "amazon" | "flipkart" | "meesho") {
    const query = encodeURIComponent(keywords.join(" "));
    const urls = {
      amazon: `https://www.amazon.in/s?k=${query}`,
      flipkart: `https://www.flipkart.com/search?q=${query}`,
      meesho: `https://www.meesho.com/search?q=${query}`,
    };
    window.open(urls[store], "_blank");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Trending Gifts
        </h1>
        <p className="text-text-secondary mt-1">
          See what&apos;s popular by occasion and age group
        </p>
      </div>

      <Card>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Occasion
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    occasion === o
                      ? "bg-primary-600 text-white"
                      : "bg-surface-tertiary text-text-secondary hover:bg-surface-secondary"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Age Group
            </label>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map((ag) => (
                <button
                  key={ag}
                  onClick={() => setAgeGroup(ag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    ageGroup === ag
                      ? "bg-accent-600 text-white"
                      : "bg-surface-tertiary text-text-secondary hover:bg-surface-secondary"
                  }`}
                >
                  {ag}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={fetchTrending} loading={loading} className="w-full">
            <TrendingUp className="h-5 w-5" />
            {loading ? "Finding trends..." : "Show Trending Gifts"}
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-text-primary">
              Top picks for {occasion} - {ageGroup}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((gift, i) => (
              <Card key={i} className="flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-text-primary leading-tight">
                    {gift.title}
                  </h3>
                  <Badge category={gift.category}>{gift.category}</Badge>
                </div>

                <p className="text-sm text-text-secondary mb-2">
                  {gift.description}
                </p>

                <p className="text-sm text-primary-600 font-medium mb-2">
                  ~{formatCurrency(gift.estimatedPrice)}
                </p>

                <div className="bg-accent-50 rounded-lg px-3 py-2 mb-3">
                  <p className="text-xs text-accent-700">
                    <TrendingUp className="inline h-3 w-3 mr-1 -mt-0.5" />
                    {gift.whyTrending}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openStore(gift.keywords, "amazon")}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Amazon
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openStore(gift.keywords, "flipkart")}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Flipkart
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openStore(gift.keywords, "meesho")}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Meesho
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
