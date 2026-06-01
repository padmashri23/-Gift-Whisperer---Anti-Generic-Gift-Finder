"use client";

import { useEffect, useState, use } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import { formatPriceRange } from "@/lib/utils";
import {
  ArrowLeft,
  Gift,
  Pencil,
  Trash2,
  Calendar,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Recipient } from "@/types/recipient";
import type { GiftIdea } from "@/types/gift";

export default function RecipientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [gifts, setGifts] = useState<GiftIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"about" | "history" | "saved">("about");

  useEffect(() => {
    async function load() {
      const [recipientRes, giftsRes] = await Promise.all([
        fetch(`/api/recipients/${id}`),
        fetch(`/api/gifts?recipientId=${id}`),
      ]);

      if (recipientRes.ok) setRecipient(await recipientRes.json());
      if (giftsRes.ok) setGifts(await giftsRes.json());
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Delete this recipient? This cannot be undone.")) return;

    const res = await fetch(`/api/recipients/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Recipient deleted");
      router.push("/recipients");
    } else {
      toast.error("Failed to delete");
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="animate-pulse h-64" />
      </div>
    );
  }

  if (!recipient) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState
          icon={Gift}
          title="Recipient not found"
          description="This person may have been removed."
          actionLabel="Back to Recipients"
          actionHref="/recipients"
        />
      </div>
    );
  }

  const givenGifts = gifts.filter((g) => g.is_given);
  const savedGifts = gifts.filter((g) => g.is_saved && !g.is_given);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/recipients"
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            {recipient.name}
          </h1>
          {recipient.relationship && (
            <p className="text-text-secondary capitalize">
              {recipient.relationship}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/find?recipientId=${id}`}>
            <Button size="sm">
              <Gift className="h-4 w-4" />
              Find Gift
            </Button>
          </Link>
          <Link href={`/recipients/${id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(["about", "history", "saved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {t === "about"
              ? "About"
              : t === "history"
                ? `Gift History (${givenGifts.length})`
                : `Saved Ideas (${savedGifts.length})`}
          </button>
        ))}
      </div>

      {tab === "about" && (
        <Card>
          <div className="space-y-4">
            {recipient.description && (
              <div>
                <h3 className="text-sm font-medium text-text-tertiary mb-1">
                  Description
                </h3>
                <p className="text-text-primary">{recipient.description}</p>
              </div>
            )}
            {recipient.interests.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-text-tertiary mb-2">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipient.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {recipient.important_dates?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-text-tertiary mb-2">
                  Important Dates
                </h3>
                <div className="space-y-1">
                  {recipient.important_dates.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-text-tertiary" />
                      <span className="font-medium">{d.label}:</span>
                      <span className="text-text-secondary">{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {recipient.notes && (
              <div>
                <h3 className="text-sm font-medium text-text-tertiary mb-1">
                  Notes
                </h3>
                <p className="text-text-secondary text-sm">
                  {recipient.notes}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {tab === "history" && (
        <div className="space-y-3">
          {givenGifts.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-text-secondary">
                No gifts given to {recipient.name} yet.
              </p>
            </Card>
          ) : (
            givenGifts.map((gift) => (
              <Card key={gift.id} padding="sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">
                      {gift.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {gift.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                      <span>
                        {formatPriceRange(
                          gift.estimated_price_min,
                          gift.estimated_price_max
                        )}
                      </span>
                      {gift.given_date && (
                        <span>Given {gift.given_date}</span>
                      )}
                      {gift.rating && (
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          {gift.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge category={gift.category}>{gift.category}</Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "saved" && (
        <div className="space-y-3">
          {savedGifts.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-text-secondary">
                No saved gift ideas for {recipient.name}.
              </p>
            </Card>
          ) : (
            savedGifts.map((gift) => (
              <Card key={gift.id} padding="sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">
                      {gift.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {gift.why_its_perfect}
                    </p>
                    <p className="text-xs text-primary-600 mt-1">
                      {formatPriceRange(
                        gift.estimated_price_min,
                        gift.estimated_price_max
                      )}
                    </p>
                  </div>
                  <Badge category={gift.category}>{gift.category}</Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
