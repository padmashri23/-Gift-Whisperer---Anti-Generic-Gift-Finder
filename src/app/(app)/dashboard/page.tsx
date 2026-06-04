"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Search, Users, Gift, Clock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Recipient } from "@/types/recipient";

export default function DashboardPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [giftCount, setGiftCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [recipientRes, giftRes] = await Promise.all([
        fetch("/api/recipients"),
        fetch("/api/gifts?given=true"),
      ]);

      if (recipientRes.ok) setRecipients(await recipientRes.json());
      if (giftRes.ok) {
        const gifts = await giftRes.json();
        setGiftCount(gifts.length);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Welcome back! Ready to find the perfect gift?
        </p>
      </div>

      {/* Quick Action */}
      <Card className="bg-gradient-to-r from-primary-500 to-accent-500 border-0 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Find a Gift</h2>
            <p className="text-white/80 mt-1">
              Describe someone and get hyper-specific gift ideas
            </p>
          </div>
          <Link href="/find">
            <Button
              variant="secondary"
              size="lg"
              className="w-full border-0 bg-white text-primary-700 hover:bg-white/90 sm:w-auto"
            >
              <Sparkles className="h-5 w-5" />
              Start
            </Button>
          </Link>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {loading ? "-" : recipients.length}
              </p>
              <p className="text-xs text-text-secondary">Recipients</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Gift className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {loading ? "-" : giftCount}
              </p>
              <p className="text-xs text-text-secondary">Gifts Given</p>
            </div>
          </div>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
              <Search className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">AI</p>
              <p className="text-xs text-text-secondary">Powered</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recipients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text-primary">
            Your Recipients
          </h2>
          <Link
            href="/recipients"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse h-20" />
            ))}
          </div>
        ) : recipients.length === 0 ? (
          <Card className="text-center py-6">
            <p className="text-text-secondary text-sm mb-3">
              No recipients yet. Add people you buy gifts for.
            </p>
            <Link href="/recipients/new">
              <Button size="sm">Add Recipient</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recipients.slice(0, 8).map((r) => (
              <Link key={r.id} href={`/recipients/${r.id}`}>
                <Card className="hover:border-primary-300 transition-colors cursor-pointer text-center py-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm font-bold text-primary-600">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-text-primary truncate px-2">
                    {r.name}
                  </p>
                  {r.relationship && (
                    <p className="text-xs text-text-tertiary capitalize">
                      {r.relationship}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/history">
          <Card className="hover:border-primary-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-text-secondary" />
              <div>
                <p className="font-medium text-text-primary">Gift History</p>
                <p className="text-sm text-text-secondary">
                  Review past gifts and rate them
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary ml-auto" />
            </div>
          </Card>
        </Link>
        <Link href="/recipients/new">
          <Card className="hover:border-primary-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-text-secondary" />
              <div>
                <p className="font-medium text-text-primary">Add Recipient</p>
                <p className="text-sm text-text-secondary">
                  Save someone you buy gifts for
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary ml-auto" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
