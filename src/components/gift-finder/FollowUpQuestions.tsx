"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { MessageCircleQuestion, ChevronRight, X } from "lucide-react";

interface FollowUpQuestion {
  question: string;
  options: string[];
}

interface FollowUpQuestionsProps {
  questions: FollowUpQuestion[];
  onComplete: (answers: string[]) => void;
  onSkip: () => void;
  loading?: boolean;
}

export default function FollowUpQuestions({
  questions,
  onComplete,
  onSkip,
  loading = false,
}: FollowUpQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  function handleSelect(option: string) {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  }

  const current = questions[currentIndex];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion className="h-5 w-5 text-accent-500" />
          <h3 className="font-semibold text-text-primary">
            Quick Questions to Nail It
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onSkip} disabled={loading}>
          <X className="h-4 w-4" />
          Skip
        </Button>
      </div>

      <div className="flex gap-1.5 mb-4">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < currentIndex
                ? "bg-primary-500"
                : i === currentIndex
                ? "bg-primary-300"
                : "bg-surface-tertiary"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-text-secondary mb-1">
        Question {currentIndex + 1} of {questions.length}
      </p>
      <p className="text-text-primary font-medium mb-4">{current.question}</p>

      <div className="space-y-2">
        {current.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={loading}
            className="w-full text-left px-4 py-3 rounded-lg border border-border bg-[var(--card-bg)] hover:bg-surface-secondary hover:border-primary-300 transition-all flex items-center justify-between group disabled:opacity-50"
          >
            <span className="text-sm text-text-primary">{option}</span>
            <ChevronRight className="h-4 w-4 text-text-tertiary group-hover:text-primary-500 transition-colors" />
          </button>
        ))}
      </div>

      {answers.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-text-tertiary mb-2">Your answers:</p>
          <div className="flex flex-wrap gap-1.5">
            {answers.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
