"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { PenLine, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface GiftMessageWriterProps {
  giftTitle: string;
  recipientDescription: string;
  whyItsPerfect: string;
}

const TONES = [
  { value: "heartfelt", label: "Heartfelt", emoji: "💝" },
  { value: "funny", label: "Funny", emoji: "😄" },
  { value: "casual", label: "Casual", emoji: "✌️" },
  { value: "formal", label: "Formal", emoji: "🎩" },
] as const;

export default function GiftMessageWriter({
  giftTitle,
  recipientDescription,
  whyItsPerfect,
}: GiftMessageWriterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tone, setTone] = useState<string>("heartfelt");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateMessage() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftTitle,
          recipientDescription,
          whyItsPerfect,
          tone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(data.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate message"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success("Message copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <PenLine className="h-3.5 w-3.5" />
        Write a Note
      </Button>
    );
  }

  return (
    <div className="space-y-3 pt-3 border-t border-border">
      <div className="flex items-center gap-2">
        <PenLine className="h-4 w-4 text-accent-500" />
        <span className="text-xs font-semibold text-text-primary">
          Gift Note
        </span>
      </div>

      <div className="flex gap-1.5">
        {TONES.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setTone(t.value);
              setMessage("");
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              tone === t.value
                ? "bg-primary-100 text-primary-700 border border-primary-300"
                : "bg-surface-secondary text-text-secondary border border-transparent hover:bg-surface-tertiary"
            }`}
          >
            <span>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      {!message ? (
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={generateMessage}
          loading={loading}
        >
          <PenLine className="h-3.5 w-3.5" />
          Generate {TONES.find((t) => t.value === tone)?.label} Note
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="rounded-lg bg-accent-50 px-3 py-2.5 border border-accent-200">
            <p className="text-sm text-accent-900 italic leading-relaxed">
              &ldquo;{message}&rdquo;
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateMessage}
              loading={loading}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
