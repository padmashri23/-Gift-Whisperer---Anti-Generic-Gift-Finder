"use client";

import { useState } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import OccasionSelector from "@/components/gift-finder/OccasionSelector";
import BudgetFilter from "@/components/gift-finder/BudgetFilter";
import GiftResultCard from "@/components/gift-finder/GiftResultCard";
import GeneratingAnimation from "@/components/gift-finder/GeneratingAnimation";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface GiftIdea {
  id: string;
  title: string;
  description: string;
  estimated_price_min: number;
  estimated_price_max: number;
  why_its_perfect: string;
  category: string;
  purchase_keywords: string[];
  is_saved: boolean;
  is_given: boolean;
}

export default function FindPage() {
  const [description, setDescription] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(5000);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GiftIdea[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();

    if (description.trim().length < 10) {
      toast.error("Please describe the recipient in at least 10 characters");
      return;
    }

    setLoading(true);
    setResults([]);
    setHasSearched(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          occasion: occasion || undefined,
          budgetMin,
          budgetMax,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate gift ideas");
      }

      setResults(data.ideas || []);
      toast.success(`Found ${data.ideas?.length || 0} gift ideas!`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Find the Perfect Gift
        </h1>
        <p className="text-text-secondary mt-1">
          Tell us about the person and we&apos;ll find something they&apos;ll
          love
        </p>
      </div>

      <Card>
        <form onSubmit={handleGenerate} className="space-y-4">
          <Textarea
            id="description"
            label="Who are you shopping for?"
            placeholder='Tell me about the person... What do they love? What are they like? Any inside jokes? Example: "My friend who just got into pottery but is intimidated by the studio, loves weird podcasts, and has a cat named Chairman Meow."'
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
          <div className="flex justify-between items-center text-xs text-text-tertiary">
            <span>Be as specific as possible for better results</span>
            <span>{description.length}/2000</span>
          </div>

          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {showOptions ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {showOptions ? "Hide options" : "More options"}
          </button>

          {showOptions && (
            <div className="space-y-4 pt-2 border-t border-border">
              <OccasionSelector value={occasion} onChange={setOccasion} />
              <BudgetFilter
                min={budgetMin}
                max={budgetMax}
                onMinChange={setBudgetMin}
                onMaxChange={setBudgetMax}
              />
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={description.trim().length < 10}
          >
            <Sparkles className="h-5 w-5" />
            {loading ? "Whispering..." : "Find Gift Ideas"}
          </Button>
        </form>
      </Card>

      {loading && <GeneratingAnimation />}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              Gift Ideas for You
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerate}
              disabled={loading}
            >
              <Sparkles className="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((idea) => (
              <GiftResultCard
                key={idea.id}
                id={idea.id}
                title={idea.title}
                description={idea.description}
                estimatedPriceMin={idea.estimated_price_min}
                estimatedPriceMax={idea.estimated_price_max}
                whyItsPerfect={idea.why_its_perfect}
                category={idea.category}
                purchaseKeywords={idea.purchase_keywords}
                isSaved={idea.is_saved}
                isGiven={idea.is_given}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-text-secondary">
            No gift ideas generated. Try describing the person differently or
            adjusting the budget.
          </p>
        </Card>
      )}
    </div>
  );
}
