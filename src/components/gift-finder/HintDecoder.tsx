"use client";

import { useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Wand2, ImagePlus, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface DecodeResult {
  description: string;
  interests: string[];
}

interface HintDecoderProps {
  occasion?: string;
  onComplete: (result: DecodeResult) => void;
  onCancel: () => void;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

interface PickedImage {
  mimeType: string;
  /** Base64 without the data: URL prefix (for the API). */
  data: string;
  /** Full data URL for the preview thumbnail. */
  preview: string;
  name: string;
}

export default function HintDecoder({
  occasion,
  onComplete,
  onCancel,
}: HintDecoderProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<PickedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read the image"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file later.
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please choose a PNG, JPEG, WebP, or GIF image");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image is too large (max 5 MB)");
      return;
    }

    try {
      const dataUrl = await readFile(file);
      const base64 = dataUrl.split(",")[1] ?? "";
      setImage({
        mimeType: file.type,
        data: base64,
        preview: dataUrl,
        name: file.name,
      });
    } catch {
      toast.error("Could not read that image");
    }
  }

  async function handleDecode() {
    const trimmed = text.trim();
    if (trimmed.length === 0 && !image) {
      toast.error("Paste what they said or add a screenshot first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/decode-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed || undefined,
          images: image ? [{ mimeType: image.mimeType, data: image.data }] : undefined,
          occasion: occasion || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to decode the hint");

      const signals: string[] = Array.isArray(data.signals) ? data.signals : [];
      toast.success(
        signals.length > 0
          ? `Decoded ${signals.length} signal${signals.length > 1 ? "s" : ""}!`
          : "Hint decoded!"
      );
      onComplete({
        description: data.description,
        interests: Array.isArray(data.interests) ? data.interests : [],
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-accent-600" />
              Decode a Hint
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Paste something they said, texted, or posted — or drop a
              screenshot — and we&apos;ll read between the lines for gift signals.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-sm text-text-secondary hover:text-text-primary shrink-0"
          >
            Cancel
          </button>
        </div>

        <Textarea
          id="hint-text"
          placeholder={`e.g. "ugh my headphones keep dying mid-call" or "I've been dying to try pottery but the classes are so expensive"`}
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={4000}
        />

        {image ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-secondary p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.preview}
              alt="Hint screenshot preview"
              className="h-16 w-16 rounded-md object-cover border border-border"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary truncate">
                {image.name}
              </p>
              <p className="text-xs text-text-tertiary">Screenshot attached</p>
            </div>
            <button
              onClick={() => setImage(null)}
              className="p-1.5 rounded-lg text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-4 text-sm font-medium text-text-secondary hover:border-primary-300 hover:bg-surface-secondary transition-colors"
          >
            <ImagePlus className="h-4 w-4" />
            Add a screenshot (optional)
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={handleFile}
          className="hidden"
        />

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Back
          </Button>
          <Button
            size="sm"
            onClick={handleDecode}
            loading={loading}
            disabled={text.trim().length === 0 && !image}
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Decoding..." : "Decode Hint"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
