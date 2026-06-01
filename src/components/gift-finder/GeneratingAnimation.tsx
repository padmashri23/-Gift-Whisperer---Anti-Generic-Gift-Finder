"use client";

import { Gift } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
  "Consulting the gift oracle...",
  "Reading their personality like a book...",
  "Exploring the corners of the internet...",
  "Thinking way outside the box...",
  "Matching vibes to gifts...",
  "Almost there, this one's special...",
];

export default function GeneratingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center animate-bounce">
          <Gift className="h-8 w-8 text-primary-600" />
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-primary-200 animate-ping opacity-20" />
      </div>
      <p className="mt-6 text-lg font-medium text-text-primary animate-pulse">
        {messages[messageIndex]}
      </p>
      <p className="mt-2 text-sm text-text-tertiary">
        This usually takes 5-10 seconds
      </p>
    </div>
  );
}
