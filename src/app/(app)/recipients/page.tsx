"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Users, Plus, Search, Gift } from "lucide-react";
import Link from "next/link";
import type { Recipient } from "@/types/recipient";

export default function RecipientsPage() {
  const router = useRouter();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/recipients");
      if (res.ok) setRecipients(await res.json());
      setLoading(false);
    }
    load();
  }, []);

  const filtered = recipients.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.relationship?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Recipients</h1>
          <p className="text-text-secondary mt-1">
            People you buy gifts for
          </p>
        </div>
        <Link href="/recipients/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Recipient
          </Button>
        </Link>
      </div>

      {recipients.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search recipients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-40" />
          ))}
        </div>
      ) : filtered.length === 0 && recipients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No recipients yet"
          description="Add people you buy gifts for to get personalized suggestions and track gift history."
          actionLabel="Add Your First Recipient"
          actionHref="/recipients/new"
        />
      ) : filtered.length === 0 ? (
        <p className="text-center text-text-secondary py-8">
          No recipients match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipient) => (
            <Link key={recipient.id} href={`/recipients/${recipient.id}`}>
              <Card className="hover:border-primary-300 hover:shadow-md transition-all cursor-pointer h-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-600">
                      {recipient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text-primary truncate">
                      {recipient.name}
                    </h3>
                    {recipient.relationship && (
                      <p className="text-xs text-text-tertiary capitalize">
                        {recipient.relationship}
                      </p>
                    )}
                    {recipient.description && (
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                        {recipient.description}
                      </p>
                    )}
                    {recipient.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recipient.interests.slice(0, 3).map((interest) => (
                          <span
                            key={interest}
                            className="text-xs bg-surface-tertiary text-text-secondary rounded-full px-2 py-0.5"
                          >
                            {interest}
                          </span>
                        ))}
                        {recipient.interests.length > 3 && (
                          <span className="text-xs text-text-tertiary">
                            +{recipient.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/find?recipientId=${recipient.id}`);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Gift className="h-3 w-3" />
                    Find gift
                  </button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
