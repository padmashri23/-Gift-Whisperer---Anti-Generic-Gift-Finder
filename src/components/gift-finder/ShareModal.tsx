"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { X, Share2, Link, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareGift {
  id: string;
  title: string;
}

interface ShareModalProps {
  gifts: ShareGift[];
  onClose: () => void;
}

export default function ShareModal({ gifts, onClose }: ShareModalProps) {
  const [title, setTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!title.trim()) {
      toast.error("Please add a title for your shared list");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          giftIds: gifts.map((g) => g.id),
          recipientName: recipientName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const url = `${window.location.origin}/shared/${data.shared.share_token}`;
      setShareUrl(url);
      toast.success("Share link created!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create share link"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <Card className="relative w-full max-w-md mx-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-text-primary">
              Share Gift Ideas
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!shareUrl ? (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Create a shareable link with {gifts.length} gift{" "}
              {gifts.length === 1 ? "idea" : "ideas"} that anyone can view.
            </p>

            <div className="space-y-2">
              {gifts.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-secondary text-sm text-text-primary"
                >
                  <Check className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                  <span className="truncate">{g.title}</span>
                </div>
              ))}
            </div>

            <Input
              id="shareTitle"
              label="List Title"
              placeholder="e.g. Gift ideas for Mom's birthday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              id="recipientName"
              label="Recipient Name (optional)"
              placeholder="e.g. Mom"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />

            <Button
              className="w-full"
              onClick={handleCreate}
              loading={loading}
              disabled={!title.trim()}
            >
              <Link className="h-4 w-4" />
              Generate Share Link
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Your share link is ready! Anyone with this link can view the gift
              ideas.
            </p>

            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary truncate"
              />
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button variant="secondary" className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
