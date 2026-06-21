"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import GiftMessageWriter from "./GiftMessageWriter";
import { formatPriceRange } from "@/lib/utils";
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ShoppingCart,
  Star,
  AlertTriangle,
  Scale,
  Gift,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface GiftResultCardProps {
  id: string;
  title: string;
  description: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  whyItsPerfect: string;
  category: string;
  purchaseKeywords: string[];
  isSaved?: boolean;
  isGiven?: boolean;
  regiftWarning?: boolean;
  recipientDescription?: string;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
  blindMode?: boolean;
}

export default function GiftResultCard({
  id,
  title,
  description,
  estimatedPriceMin,
  estimatedPriceMax,
  whyItsPerfect,
  category,
  purchaseKeywords,
  isSaved: initialSaved = false,
  isGiven: initialGiven = false,
  regiftWarning = false,
  recipientDescription = "",
  isComparing = false,
  onToggleCompare,
  blindMode = false,
}: GiftResultCardProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isGiven, setIsGiven] = useState(initialGiven);
  const [saving, setSaving] = useState(false);
  const [manualReveal, setManualReveal] = useState(false);

  // Covered only while surprise mode is on and the user hasn't revealed it yet.
  // Regenerating results remounts the card, which resets manualReveal.
  const revealed = !blindMode || manualReveal;

  async function toggleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/gifts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_saved: !isSaved }),
      });
      if (res.ok) {
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Removed from saved" : "Saved for later");
      }
    } catch {
      toast.error("Failed to update");
    }
    setSaving(false);
  }

  async function markAsGiven() {
    try {
      const res = await fetch(`/api/gifts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_given: true,
          given_date: new Date().toISOString().split("T")[0],
        }),
      });
      if (res.ok) {
        setIsGiven(true);
        toast.success("Marked as given!");
      }
    } catch {
      toast.error("Failed to update");
    }
  }

  function openStore(store: "amazon" | "flipkart" | "meesho") {
    const query = encodeURIComponent(purchaseKeywords.join(" "));
    const urls = {
      amazon: `https://www.amazon.in/s?k=${query}`,
      flipkart: `https://www.flipkart.com/search?q=${query}`,
      meesho: `https://www.meesho.com/search?q=${query}`,
    };
    window.open(urls[store], "_blank");
  }

  const storeButtons = [
    { key: "amazon" as const, label: "Amazon", color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
    { key: "flipkart" as const, label: "Flipkart", color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" },
    { key: "meesho" as const, label: "Meesho", color: "hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200" },
  ];

  if (blindMode && !revealed) {
    return (
      <button
        type="button"
        onClick={() => setManualReveal(true)}
        className="group relative flex min-h-[220px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-accent-200 bg-gradient-to-br from-primary-500 to-accent-600 p-6 text-center transition-transform hover:scale-[1.02]"
        title="Reveal this gift idea"
      >
        <span className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_35%)]" />
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:rotate-6">
          <Gift className="h-7 w-7 text-white" />
        </span>
        <span className="text-base font-semibold text-white">
          A gift idea awaits
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Eye className="h-3.5 w-3.5" />
          Tap to reveal
        </span>
      </button>
    );
  }

  return (
    <Card className={`flex flex-col h-full ${regiftWarning ? "ring-2 ring-warning/50" : ""} ${isComparing ? "ring-2 ring-primary-500" : ""}`}>
      {regiftWarning && (
        <div className="flex items-center gap-2 bg-warning/10 text-warning rounded-lg px-3 py-2 mb-3 text-xs font-medium">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          You&apos;ve given a similar gift before
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-text-primary leading-tight">
            {title}
          </h3>
          <p className="text-sm text-primary-600 font-medium mt-1">
            {formatPriceRange(estimatedPriceMin, estimatedPriceMax)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isComparing
                  ? "bg-primary-100 text-primary-600"
                  : "text-text-tertiary hover:bg-surface-secondary hover:text-text-secondary"
              }`}
              title={isComparing ? "Remove from compare" : "Add to compare"}
            >
              <Scale className="h-4 w-4" />
            </button>
          )}
          <Badge category={category}>{category}</Badge>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-3">{description}</p>

      <div className="mb-4 rounded-lg bg-primary-50 px-3 py-2 dark:bg-primary-900/30">
        <p className="text-sm text-primary-800 dark:text-primary-100">
          <Star className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
          <span className="font-medium">Why it&apos;s perfect:</span>{" "}
          {whyItsPerfect}
        </p>
      </div>

      <div className="mt-auto space-y-3 border-t border-border pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSave}
            loading={saving}
            className={isSaved ? "text-primary-600" : ""}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isSaved ? "Saved" : "Save"}
          </Button>

          {!isGiven ? (
            <Button variant="ghost" size="sm" onClick={markAsGiven}>
              <CheckCircle2 className="h-4 w-4" />
              Mark Given
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 text-xs font-medium text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Given
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-tertiary flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            Find best price
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {storeButtons.map((store) => (
              <button
                key={store.key}
                onClick={() => openStore(store.key)}
                className={`px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary transition-all ${store.color}`}
              >
                {store.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-text-tertiary">
            {purchaseKeywords.slice(0, 3).join(" · ")}
          </p>
        </div>

        <GiftMessageWriter
          giftTitle={title}
          recipientDescription={recipientDescription}
          whyItsPerfect={whyItsPerfect}
        />
      </div>
    </Card>
  );
}
