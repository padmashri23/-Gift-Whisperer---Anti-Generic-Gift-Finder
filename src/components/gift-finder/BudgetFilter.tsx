"use client";

import { formatCurrency } from "@/lib/utils";

interface BudgetFilterProps {
  min: number;
  max: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export default function BudgetFilter({
  min,
  max,
  onMinChange,
  onMaxChange,
}: BudgetFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-primary">
          Budget Range
        </label>
        <span className="text-sm text-text-secondary">
          {formatCurrency(min)} - {formatCurrency(max)}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-text-tertiary mb-1 block">Min</label>
          <input
            type="range"
            min={0}
            max={100000}
            step={500}
            value={min}
            onChange={(e) => {
              const v = Number(e.target.value);
              onMinChange(Math.min(v, max));
            }}
            className="w-full accent-primary-500"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-text-tertiary mb-1 block">Max</label>
          <input
            type="range"
            min={0}
            max={100000}
            step={500}
            value={max}
            onChange={(e) => {
              const v = Number(e.target.value);
              onMaxChange(Math.max(v, min));
            }}
            className="w-full accent-primary-500"
          />
        </div>
      </div>
    </div>
  );
}
