"use client";

import { cn } from "@/lib/utils";

const occasions = [
  { label: "Birthday", emoji: "🎂" },
  { label: "Christmas", emoji: "🎄" },
  { label: "Anniversary", emoji: "💍" },
  { label: "Valentine's Day", emoji: "❤️" },
  { label: "Mother's Day", emoji: "👩" },
  { label: "Father's Day", emoji: "👨" },
  { label: "Graduation", emoji: "🎓" },
  { label: "Wedding", emoji: "💒" },
  { label: "Baby Shower", emoji: "👶" },
  { label: "Housewarming", emoji: "🏠" },
  { label: "Thank You", emoji: "🙏" },
  { label: "Just Because", emoji: "✨" },
];

interface OccasionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OccasionSelector({
  value,
  onChange,
}: OccasionSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        Occasion
      </label>
      <div className="flex flex-wrap gap-2">
        {occasions.map((occasion) => (
          <button
            key={occasion.label}
            type="button"
            onClick={() =>
              onChange(value === occasion.label ? "" : occasion.label)
            }
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              value === occasion.label
                ? "bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100"
                : "bg-[var(--input-bg)] border-border text-text-secondary hover:bg-surface-secondary"
            )}
          >
            <span>{occasion.emoji}</span>
            {occasion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
