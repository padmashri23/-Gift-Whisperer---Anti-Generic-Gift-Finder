"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Gift,
  Search,
  Users,
  Clock,
  Settings,
  LayoutDashboard,
  CalendarDays,
  TrendingUp,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/find", label: "Find Gift", icon: Search },
  { href: "/recipients", label: "Recipients", icon: Users },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/history", label: "Gift History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-[var(--card-bg)] shadow-xl">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Gift className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">
              Gift Whisperer
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
