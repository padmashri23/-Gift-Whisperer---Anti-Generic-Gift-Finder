"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(100);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setDisplayName(data.display_name || "");
        setBudgetMin(data.default_budget_min);
        setBudgetMax(data.default_budget_max);
      }
      setFetching(false);
    }
    load();
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        default_budget_min: budgetMin,
        default_budget_max: budgetMax,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved!");
    }
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your profile and preferences</p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-5">
          <h2 className="text-lg font-semibold text-text-primary">Profile</h2>

          <Input
            id="displayName"
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-primary">
              Default Budget Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="budgetMin"
                label="Minimum ($)"
                type="number"
                min={0}
                max={10000}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
              />
              <Input
                id="budgetMax"
                label="Maximum ($)"
                type="number"
                min={0}
                max={10000}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
              />
            </div>
          </div>

          <Button type="submit" loading={loading}>
            Save Settings
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Account
        </h2>
        <Button variant="danger" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Card>
    </div>
  );
}
