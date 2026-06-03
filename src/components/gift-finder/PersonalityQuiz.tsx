"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ChevronRight, ChevronLeft, Sparkles, RotateCcw } from "lucide-react";

interface QuizResult {
  description: string;
  interests: string[];
}

interface PersonalityQuizProps {
  onComplete: (result: QuizResult) => void;
  onCancel: () => void;
}

const questions = [
  {
    id: "personality",
    question: "How would you describe their personality?",
    options: [
      { label: "Adventurous & outdoorsy", value: "adventurous and loves outdoor activities" },
      { label: "Creative & artistic", value: "creative and artistically inclined" },
      { label: "Nerdy & intellectual", value: "intellectual and loves learning new things" },
      { label: "Social & outgoing", value: "social butterfly who loves being around people" },
      { label: "Calm & homebody", value: "calm person who enjoys cozy time at home" },
      { label: "Ambitious & driven", value: "ambitious and career-focused" },
    ],
  },
  {
    id: "weekend",
    question: "How do they usually spend weekends?",
    options: [
      { label: "Hiking, trekking, or sports", value: "hiking and outdoor sports" },
      { label: "Reading or watching shows", value: "reading books and watching shows" },
      { label: "Cooking or baking", value: "cooking and experimenting with food" },
      { label: "Shopping or socializing", value: "shopping and hanging out with friends" },
      { label: "Gaming or tech projects", value: "gaming and tinkering with technology" },
      { label: "Art, music, or crafts", value: "making art, music, or crafts" },
    ],
  },
  {
    id: "ageGroup",
    question: "What age group are they in?",
    options: [
      { label: "Teen (13-19)", value: "teenager" },
      { label: "Young adult (20-30)", value: "young adult in their 20s" },
      { label: "Adult (31-45)", value: "adult in their 30s-40s" },
      { label: "Middle-aged (46-60)", value: "middle-aged person" },
      { label: "Senior (60+)", value: "senior citizen" },
    ],
  },
  {
    id: "style",
    question: "What's their style vibe?",
    options: [
      { label: "Minimalist & modern", value: "minimalist and modern aesthetic" },
      { label: "Traditional & classic", value: "traditional and classic taste" },
      { label: "Quirky & fun", value: "quirky personality who loves fun and unusual things" },
      { label: "Luxury & premium", value: "appreciates luxury and premium quality" },
      { label: "Eco-friendly & sustainable", value: "environmentally conscious and prefers sustainable products" },
    ],
  },
  {
    id: "interests",
    question: "Pick their top interests (select all that apply)",
    multi: true,
    options: [
      { label: "Fitness & health", value: "fitness" },
      { label: "Travel", value: "travel" },
      { label: "Photography", value: "photography" },
      { label: "Music", value: "music" },
      { label: "Gardening", value: "gardening" },
      { label: "Cooking", value: "cooking" },
      { label: "Fashion", value: "fashion" },
      { label: "Tech & gadgets", value: "technology" },
      { label: "Books & reading", value: "reading" },
      { label: "Art & design", value: "art" },
      { label: "Sports", value: "sports" },
      { label: "Movies & TV", value: "movies" },
      { label: "Pets & animals", value: "pets" },
      { label: "DIY & crafts", value: "DIY crafts" },
    ],
  },
  {
    id: "budget",
    question: "What kind of gift are they expecting?",
    options: [
      { label: "Something thoughtful & personal", value: "values thoughtful and personal gifts over expensive ones" },
      { label: "Something practical & useful", value: "prefers practical gifts they can use daily" },
      { label: "Something fun & surprising", value: "loves fun surprises and unique gifts" },
      { label: "Something premium & luxurious", value: "appreciates premium and high-quality gifts" },
    ],
  },
];

export default function PersonalityQuiz({ onComplete, onCancel }: PersonalityQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const current = questions[step];
  const isMulti = "multi" in current && current.multi;
  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;

  function selectOption(value: string) {
    if (isMulti) {
      const prev = (answers[current.id] as string[]) || [];
      const updated = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      setAnswers({ ...answers, [current.id]: updated });
    } else {
      setAnswers({ ...answers, [current.id]: value });
      if (step < totalSteps - 1) {
        setTimeout(() => setStep(step + 1), 200);
      }
    }
  }

  function isSelected(value: string) {
    const answer = answers[current.id];
    if (isMulti) return (answer as string[] | undefined)?.includes(value) ?? false;
    return answer === value;
  }

  function canProceed() {
    const answer = answers[current.id];
    if (!answer) return false;
    if (isMulti) return (answer as string[]).length > 0;
    return true;
  }

  function handleFinish() {
    const personality = answers.personality as string || "";
    const weekend = answers.weekend as string || "";
    const ageGroup = answers.ageGroup as string || "";
    const style = answers.style as string || "";
    const interestsArr = (answers.interests as string[]) || [];
    const giftPref = answers.budget as string || "";

    const description = `A ${ageGroup} who is ${personality}. They enjoy ${weekend} on weekends. They have a ${style} and ${giftPref}.`;

    onComplete({
      description,
      interests: interestsArr,
    });
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Gift Personality Quiz
          </h2>
          <button
            onClick={onCancel}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Skip quiz
          </button>
        </div>

        <div className="w-full bg-surface-tertiary rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-text-tertiary text-right">
          Question {step + 1} of {totalSteps}
        </p>

        <div>
          <h3 className="text-base font-medium text-text-primary mb-4">
            {current.question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectOption(opt.value)}
                className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  isSelected(opt.value)
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-border text-text-secondary hover:border-primary-300 hover:bg-surface-secondary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAnswers({});
                setStep(0);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {step < totalSteps - 1 ? (
            <Button
              size="sm"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleFinish}
              disabled={!canProceed()}
            >
              <Sparkles className="h-4 w-4" />
              Generate Gift Ideas
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
