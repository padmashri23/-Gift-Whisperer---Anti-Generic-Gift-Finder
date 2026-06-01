"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
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

export default function EditRecipientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [description, setDescription] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/recipients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setRelationship(data.relationship || "");
        setDescription(data.description || "");
        setInterests(data.interests || []);
        setNotes(data.notes || "");
      }
      setFetching(false);
    }
    load();
  }, [id]);

  function addInterest() {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/recipients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          relationship: relationship || undefined,
          description: description || undefined,
          interests,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      toast.success("Updated!");
      router.push(`/recipients/${id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
      <div className="flex items-center gap-3">
        <Link
          href={`/recipients/${id}`}
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Edit {name}
          </h1>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Name"
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
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
                className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
                      onClick={() =>
                        setInterests(interests.filter((i) => i !== interest))
                      }
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
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">
              Save Changes
            </Button>
            <Link href={`/recipients/${id}`}>
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
