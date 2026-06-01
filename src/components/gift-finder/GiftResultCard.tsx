"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatPriceRange } from "@/lib/utils";
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  Star,
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
}: GiftResultCardProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isGiven, setIsGiven] = useState(initialGiven);
  const [saving, setSaving] = useState(false);

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

  function searchOnline() {
    const query = encodeURIComponent(purchaseKeywords.join(" "));
    window.open(
      `https://www.google.com/search?tbm=shop&q=${query}`,
      "_blank"
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-text-primary leading-tight">
            {title}
          </h3>
          <p className="text-sm text-primary-600 font-medium mt-1">
            {formatPriceRange(estimatedPriceMin, estimatedPriceMax)}
          </p>
        </div>
        <Badge category={category}>{category}</Badge>
      </div>

      <p className="text-sm text-text-secondary mb-3">{description}</p>

      <div className="bg-primary-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-sm text-primary-800">
          <Star className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
          <span className="font-medium">Why it&apos;s perfect:</span>{" "}
          {whyItsPerfect}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-2">
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
          <span className="inline-flex items-center gap-1 text-xs text-success font-medium px-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Given
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={searchOnline}
          className="ml-auto"
        >
          <ExternalLink className="h-4 w-4" />
          Buy
        </Button>
      </div>
    </Card>
  );
}
