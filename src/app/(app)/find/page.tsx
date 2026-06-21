"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import OccasionSelector from "@/components/gift-finder/OccasionSelector";
import BudgetFilter from "@/components/gift-finder/BudgetFilter";
import GiftResultCard from "@/components/gift-finder/GiftResultCard";
import GeneratingAnimation from "@/components/gift-finder/GeneratingAnimation";
import PersonalityQuiz from "@/components/gift-finder/PersonalityQuiz";
import HintDecoder from "@/components/gift-finder/HintDecoder";
import FollowUpQuestions from "@/components/gift-finder/FollowUpQuestions";
import CompareDrawer from "@/components/gift-finder/CompareDrawer";
import ShareModal from "@/components/gift-finder/ShareModal";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Scale,
  Share2,
  User,
  Wand2,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

interface GiftIdea {
  id: string;
  title: string;
  description: string;
  estimated_price_min: number;
  estimated_price_max: number;
  why_its_perfect: string;
  category: string;
  purchase_keywords: string[];
  is_saved: boolean;
  is_given: boolean;
  regift_warning?: boolean;
}

interface FollowUpQuestion {
  question: string;
  options: string[];
}

export default function FindPage() {
  const searchParams = useSearchParams();
  const recipientId = searchParams.get("recipientId");

  const [description, setDescription] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(5000);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GiftIdea[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [blindMode, setBlindMode] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const [recipientName, setRecipientName] = useState("");
  const [recipientRelationship, setRecipientRelationship] = useState("");
  const [recipientInterests, setRecipientInterests] = useState<string[]>([]);

  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>([]);

  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setInitLoading(false);
        return;
      }

      const userId = session.user.id;
      const profilePromise = supabase
        .from("profiles")
        .select("default_budget_min, default_budget_max")
        .eq("id", userId)
        .single();

      const recipientPromise = recipientId
        ? supabase
            .from("recipients")
            .select("name, relationship, description, interests")
            .eq("id", recipientId)
            .eq("user_id", userId)
            .single()
        : null;

      const [{ data: profile }, recipientResult] = await Promise.all([
        profilePromise,
        recipientPromise,
      ]);

      if (profile) {
        setBudgetMin(profile.default_budget_min);
        setBudgetMax(profile.default_budget_max);
      }

      if (recipientResult?.data) {
        const recipient = recipientResult.data;
        setRecipientName(recipient.name);
        setRecipientRelationship(recipient.relationship || "");
        setRecipientInterests(recipient.interests || []);
        if (recipient.description) {
          setDescription(recipient.description);
        }
        setShowOptions(true);
      }

      setInitLoading(false);
    }
    init();
  }, [recipientId]);

  async function fetchFollowUpQuestions() {
    if (description.trim().length < 10) {
      toast.error("Please describe the recipient in at least 10 characters");
      return;
    }

    setFollowUpLoading(true);
    try {
      const res = await fetch("/api/ai/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          occasion: occasion || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.questions && data.questions.length > 0) {
        setFollowUpQuestions(data.questions);
        setShowFollowUp(true);
      } else {
        handleGenerate();
      }
    } catch {
      handleGenerate();
    } finally {
      setFollowUpLoading(false);
    }
  }

  function handleFollowUpComplete(answers: string[]) {
    setFollowUpAnswers(answers);
    setShowFollowUp(false);

    const enriched =
      description.trim() +
      "\n\nAdditional context from follow-up:\n" +
      answers.map((a, i) => `- ${followUpQuestions[i]?.question}: ${a}`).join("\n");

    handleGenerate(undefined, enriched);
  }

  function handleFollowUpSkip() {
    setShowFollowUp(false);
    handleGenerate();
  }

  async function handleGenerate(e?: React.FormEvent, enrichedDescription?: string) {
    if (e) e.preventDefault();

    const desc = enrichedDescription || description.trim();
    if (desc.length < 10) {
      toast.error("Please describe the recipient in at least 10 characters");
      return;
    }

    setLoading(true);
    setResults([]);
    setHasSearched(true);
    setCompareIds(new Set());

    try {
      const payload: Record<string, unknown> = {
        description: desc,
        occasion: occasion || undefined,
        budgetMin,
        budgetMax,
      };

      if (recipientId) {
        payload.recipientId = recipientId;
      }
      if (recipientName) {
        payload.recipientName = recipientName;
      }
      if (recipientRelationship) {
        payload.relationship = recipientRelationship;
      }
      if (recipientInterests.length > 0) {
        payload.interests = recipientInterests;
      }

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate gift ideas");
      }

      setResults(data.ideas || []);
      toast.success(`Found ${data.ideas?.length || 0} gift ideas!`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchFollowUpQuestions();
  }

  function handleQuizComplete(result: {
    description: string;
    interests: string[];
  }) {
    setDescription(result.description);
    setShowQuiz(false);
    toast.success(
      "Quiz complete! Description filled in. Review and hit Generate."
    );
  }

  function handleHintComplete(result: {
    description: string;
    interests: string[];
  }) {
    setDescription(result.description);
    if (result.interests.length > 0) {
      setRecipientInterests((prev) =>
        Array.from(new Set([...prev, ...result.interests]))
      );
    }
    setShowHint(false);
    toast.success("Hint decoded! Review the description and hit Find.");
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      } else {
        toast.error("You can compare up to 3 gifts at a time");
        return prev;
      }
      return next;
    });
  }

  function removeFromCompare(id: string) {
    setCompareIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  const compareGifts = results
    .filter((r) => compareIds.has(r.id))
    .map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      estimatedPriceMin: r.estimated_price_min,
      estimatedPriceMax: r.estimated_price_max,
      whyItsPerfect: r.why_its_perfect,
      category: r.category,
    }));

  const shareGifts = results.map((r) => ({ id: r.id, title: r.title }));

  if (initLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Find the Perfect Gift
          </h1>
          <p className="text-text-secondary mt-1">Loading...</p>
        </div>
        <Card className="animate-pulse h-64" />
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Gift Personality Quiz
          </h1>
          <p className="text-text-secondary mt-1">
            Answer a few questions and we&apos;ll build a profile for you
          </p>
        </div>
        <PersonalityQuiz
          onComplete={handleQuizComplete}
          onCancel={() => setShowQuiz(false)}
        />
      </div>
    );
  }

  if (showHint) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Decode a Hint
          </h1>
          <p className="text-text-secondary mt-1">
            Turn something they said or shared into the perfect gift
          </p>
        </div>
        <HintDecoder
          occasion={occasion || undefined}
          onComplete={handleHintComplete}
          onCancel={() => setShowHint(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Find the Perfect Gift
        </h1>
        <p className="text-text-secondary mt-1">
          Tell us about the person and we&apos;ll find something they&apos;ll
          love
        </p>
      </div>

      {recipientName && (
        <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-2.5 border border-primary-200">
          <User className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-800">
            Finding gifts for {recipientName}
            {recipientRelationship ? ` (${recipientRelationship})` : ""}
          </span>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-text-primary"
            >
              Who are you shopping for?
            </label>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
              >
                <Wand2 className="h-4 w-4" />
                Decode a Hint
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowQuiz(true)}
              >
                <ClipboardList className="h-4 w-4" />
                Take Quiz
              </Button>
            </div>
          </div>

          <Textarea
            id="description"
            placeholder='Tell me about the person... What do they love? What are they like? Any inside jokes? Example: "My friend who just got into pottery but is intimidated by the studio, loves weird podcasts, and has a cat named Chairman Meow."'
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
          <div className="flex justify-between items-center text-xs text-text-tertiary">
            <span>Be as specific as possible for better results</span>
            <span>{description.length}/2000</span>
          </div>

          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {showOptions ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {showOptions ? "Hide options" : "More options"}
          </button>

          {showOptions && (
            <div className="space-y-4 pt-2 border-t border-border">
              <OccasionSelector value={occasion} onChange={setOccasion} />
              <BudgetFilter
                min={budgetMin}
                max={budgetMax}
                onMinChange={setBudgetMin}
                onMaxChange={setBudgetMax}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setBlindMode((v) => !v)}
            className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
              blindMode
                ? "border-accent-300 bg-accent-50 dark:bg-accent-900/20"
                : "border-border bg-[var(--input-bg)] hover:bg-surface-secondary"
            }`}
          >
            <Gift
              className={`h-5 w-5 shrink-0 ${
                blindMode ? "text-accent-600" : "text-text-tertiary"
              }`}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-text-primary">
                Surprise mode
              </span>
              <span className="block text-xs text-text-tertiary">
                Hide each idea behind a cover — reveal them one at a time
              </span>
            </span>
            <span
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                blindMode ? "bg-accent-600" : "bg-surface-tertiary"
              }`}
              aria-hidden="true"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  blindMode ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading || followUpLoading}
            disabled={description.trim().length < 10}
          >
            <Sparkles className="h-5 w-5" />
            {loading
              ? "Whispering..."
              : followUpLoading
              ? "Thinking..."
              : "Find Gift Ideas"}
          </Button>
        </form>
      </Card>

      {showFollowUp && followUpQuestions.length > 0 && (
        <FollowUpQuestions
          questions={followUpQuestions}
          onComplete={handleFollowUpComplete}
          onSkip={handleFollowUpSkip}
          loading={loading}
        />
      )}

      {loading && <GeneratingAnimation />}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Gift Ideas for You
            </h2>
            <div className="flex items-center gap-2">
              {compareIds.size >= 2 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCompare(true)}
                >
                  <Scale className="h-4 w-4" />
                  Compare ({compareIds.size})
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowShare(true)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleGenerate()}
                disabled={loading}
              >
                <Sparkles className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </div>

          {followUpAnswers.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {followUpAnswers.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700 border border-accent-200"
                >
                  {a}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((idea) => (
              <GiftResultCard
                key={idea.id}
                id={idea.id}
                title={idea.title}
                description={idea.description}
                estimatedPriceMin={idea.estimated_price_min}
                estimatedPriceMax={idea.estimated_price_max}
                whyItsPerfect={idea.why_its_perfect}
                category={idea.category}
                purchaseKeywords={idea.purchase_keywords}
                isSaved={idea.is_saved}
                isGiven={idea.is_given}
                regiftWarning={idea.regift_warning}
                recipientDescription={description}
                isComparing={compareIds.has(idea.id)}
                onToggleCompare={toggleCompare}
                blindMode={blindMode}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-text-secondary">
            No gift ideas generated. Try describing the person differently or
            adjusting the budget.
          </p>
        </Card>
      )}

      {showCompare && compareGifts.length >= 2 && (
        <CompareDrawer
          gifts={compareGifts}
          onClose={() => setShowCompare(false)}
          onRemove={removeFromCompare}
        />
      )}

      {showShare && (
        <ShareModal
          gifts={shareGifts}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
