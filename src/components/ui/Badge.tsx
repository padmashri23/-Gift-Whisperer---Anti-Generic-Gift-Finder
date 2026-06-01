import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  experience: "bg-blue-100 text-blue-700",
  handmade: "bg-amber-100 text-amber-700",
  tech: "bg-slate-100 text-slate-700",
  book: "bg-emerald-100 text-emerald-700",
  subscription: "bg-purple-100 text-purple-700",
  "food-drink": "bg-orange-100 text-orange-700",
  home: "bg-teal-100 text-teal-700",
  fashion: "bg-pink-100 text-pink-700",
  "hobby-gear": "bg-indigo-100 text-indigo-700",
  novelty: "bg-rose-100 text-rose-700",
  default: "bg-gray-100 text-gray-700",
};

interface BadgeProps {
  children: React.ReactNode;
  category?: string;
  className?: string;
}

export default function Badge({ children, category, className }: BadgeProps) {
  const colors = category
    ? colorMap[category] || colorMap.default
    : colorMap.default;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors,
        className
      )}
    >
      {children}
    </span>
  );
}
