"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import AvatarUpload from "@/components/ui/AvatarUpload";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const relationships = [
  "friend",
  "partner",
  "parent",
  "sibling",
  "child",
  "coworker",
  "boss",
  "grandparent",
  "aunt/uncle",
  "cousin",
  "neighbor",
  "teacher",
  "other",
];

export default function NewRecipientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [description, setDescription] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [notes, setNotes] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  function addInterest() {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput("");
    }
  }

  function removeInterest(interest: string) {
    setInterests(interests.filter((i) => i !== interest));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          relationship: relationship || undefined,
          description: description || undefined,
          interests,
          notes: notes || undefined,
          avatar_url: avatarUrl || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create recipient");
      }

      toast.success(`${name} added!`);
      router.push("/recipients");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/recipients"
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Add Recipient
          </h1>
          <p className="text-text-secondary mt-1">
            Save someone you buy gifts for
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AvatarUpload
            currentUrl={avatarUrl}
            onUpload={setAvatarUrl}
            folder="recipients"
          />

          <Input
            id="name"
            label="Name"
            placeholder="Their name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-primary">
              Relationship
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Select...</option>
              {relationships.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            id="description"
            label="Description"
            placeholder="What are they like? What do they love? Any quirks or inside jokes?"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Interests
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add an interest..."
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInterest();
                  }
                }}
                className="flex-1 rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addInterest}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 rounded-full px-2.5 py-1 text-sm"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="hover:text-primary-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Textarea
            id="notes"
            label="Notes"
            placeholder="Anything else to remember (sizes, allergies, etc.)"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">
              Add Recipient
            </Button>
            <Link href="/recipients">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
