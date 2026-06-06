"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatPriceRange } from "@/lib/utils";
import { X, Star, Scale, TrendingUp, Heart, Package } from "lucide-react";

interface CompareGift {
  id: string;
  title: string;
  description: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  whyItsPerfect: string;
  category: string;
}

interface CompareDrawerProps {
  gifts: CompareGift[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

function priceScore(min: number, max: number): string {
  const avg = (min + max) / 2;
  if (avg < 1500) return "Budget-friendly";
  if (avg < 3500) return "Mid-range";
  return "Premium";
}

function uniquenessScore(category: string): string {
  const unique = ["handmade", "experience", "novelty"];
  const moderate = ["hobby-gear", "book", "subscription"];
  if (unique.includes(category)) return "High";
  if (moderate.includes(category)) return "Medium";
  return "Standard";
}

export default function CompareDrawer({
  gifts,
  onClose,
  onRemove,
}: CompareDrawerProps) {
  if (gifts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl mx-4 mb-0 sm:mb-4">
        <div className="sticky top-0 z-10 bg-[var(--surface)] border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-text-primary">
              Compare Gifts ({gifts.length})
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider pb-3 pr-4 w-32">
                    Attribute
                  </th>
                  {gifts.map((gift) => (
                    <th key={gift.id} className="text-left pb-3 px-3 min-w-[200px]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-text-primary leading-tight">
                            {gift.title}
                          </p>
                          <Badge category={gift.category} className="mt-1">
                            {gift.category}
                          </Badge>
                        </div>
                        <button
                          onClick={() => onRemove(gift.id)}
                          className="text-text-tertiary hover:text-error shrink-0 mt-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Price
                    </div>
                  </td>
                  {gifts.map((g) => (
                    <td key={g.id} className="py-3 px-3">
                      <p className="text-sm font-medium text-primary-600">
                        {formatPriceRange(g.estimatedPriceMin, g.estimatedPriceMax)}
                      </p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {priceScore(g.estimatedPriceMin, g.estimatedPriceMax)}
                      </p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                      <Star className="h-3.5 w-3.5" />
                      Uniqueness
                    </div>
                  </td>
                  {gifts.map((g) => (
                    <td key={g.id} className="py-3 px-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          uniquenessScore(g.category) === "High"
                            ? "bg-emerald-100 text-emerald-700"
                            : uniquenessScore(g.category) === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {uniquenessScore(g.category)}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                      <Heart className="h-3.5 w-3.5" />
                      Why Perfect
                    </div>
                  </td>
                  {gifts.map((g) => (
                    <td key={g.id} className="py-3 px-3">
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {g.whyItsPerfect}
                      </p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                      <Package className="h-3.5 w-3.5" />
                      Type
                    </div>
                  </td>
                  {gifts.map((g) => (
                    <td key={g.id} className="py-3 px-3">
                      <p className="text-xs text-text-secondary">
                        {g.description}
                      </p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
