"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Camera, User } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AvatarUploadProps {
  currentUrl: string | null;
  onUpload: (url: string) => void;
  folder: string;
  size?: number;
}

export default function AvatarUpload({
  currentUrl,
  onUpload,
  folder,
  size = 80,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast.error("Upload failed");
      setPreview(currentUrl);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    onUpload(data.publicUrl);
    setPreview(data.publicUrl);
    setUploading(false);
    toast.success("Photo uploaded!");
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="relative rounded-full overflow-hidden border-2 border-border hover:border-primary-400 transition-colors group"
        style={{ width: size, height: size }}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Avatar"
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-surface-tertiary flex items-center justify-center">
            <User className="h-8 w-8 text-text-tertiary" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-5 w-5 text-white" />
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>

      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {preview ? "Change photo" : "Upload photo"}
        </button>
        <p className="text-xs text-text-tertiary mt-0.5">JPG, PNG under 2MB</p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
