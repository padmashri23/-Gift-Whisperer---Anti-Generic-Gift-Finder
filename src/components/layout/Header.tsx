"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import MobileNav from "./MobileNav";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-[var(--card-bg)]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">
          <button
            className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
