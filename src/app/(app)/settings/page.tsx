"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AvatarUpload from "@/components/ui/AvatarUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User, IndianRupee, Shield, LogOut, Save, Mail } from "lucide-react";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      setEmail(session.user.email || "");
      setUserId(session.user.id);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setDisplayName(data.display_name || "");
        setBudgetMin(data.default_budget_min);
        setBudgetMax(data.default_budget_max);
        setAvatarUrl(data.avatar_url || null);
      }
      setFetching(false);
    }
    load();
  }, []);

  async function handleAvatarUpload(url: string) {
    setAvatarUrl(url);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", session.user.id);

    if (error) {
      toast.error("Photo uploaded but couldn't be saved to your profile");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (budgetMin > budgetMax) {
      toast.error("Minimum budget cannot be greater than maximum");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        default_budget_min: budgetMin,
        default_budget_max: budgetMax,
        avatar_url: avatarUrl,
        preferred_currency: "INR",
      })
      .eq("id", session.user.id);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved!");
    }
    setLoading(false);
  }

  async function handleSignOut() {
    setSignOutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-1">Manage your profile and preferences</p>
        </div>
        <Card className="animate-pulse h-48" />
        <Card className="animate-pulse h-32" />
        <Card className="animate-pulse h-24" />
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
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Profile photo
            </label>
            <AvatarUpload
              currentUrl={avatarUrl}
              onUpload={handleAvatarUpload}
              folder={userId || "avatars"}
              size={80}
            />
          </div>

          <Input
            id="displayName"
            label="Display Name"
            placeholder="What should we call you?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Email
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg border border-border">
              <Mail className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm text-text-secondary">{email}</span>
            </div>
            <p className="text-xs text-text-tertiary mt-1">Email cannot be changed here</p>
          </div>

          <div className="pt-2 border-t border-border space-y-3">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary-600" />
              <h3 className="text-sm font-semibold text-text-primary">
                Default Budget Range
              </h3>
            </div>
            <p className="text-xs text-text-tertiary">
              This will be pre-filled when you search for gift ideas
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="budgetMin"
                label="Minimum (₹)"
                type="number"
                min={0}
                max={100000}
                step={100}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
              />
              <Input
                id="budgetMax"
                label="Maximum (₹)"
                type="number"
                min={0}
                max={100000}
                step={100}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
              />
            </div>
          </div>

          <Button type="submit" loading={loading}>
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-text-primary">Account</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text-primary">Sign out</p>
              <p className="text-xs text-text-tertiary">
                You&apos;ll need to sign in again to access your data
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={handleSignOut} loading={signOutLoading}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
