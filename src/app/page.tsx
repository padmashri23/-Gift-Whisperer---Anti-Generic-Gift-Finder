import { Gift, Sparkles, MessageSquare, ShoppingBag, ArrowRight, Heart, Zap, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Gift Whisperer - Find the Perfect Gift with AI",
  description:
    "Describe someone you love and get hyper-specific, creative gift ideas powered by AI. Never give a generic gift again.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--surface)]">
      {/* Header */}
      <header className="border-b border-border bg-[var(--card-bg)]">
        <div className="mx-auto flex h-16 w-full max-w-[19rem] items-center justify-between px-4 sm:max-w-6xl sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Gift className="h-4 w-4 text-white" />
            </div>
            <span className="truncate text-base font-bold text-text-primary sm:text-lg">
              Gift Whisperer
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-text-secondary transition-colors hover:text-text-primary sm:inline"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              aria-label="Get started"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-4 sm:py-2"
            >
              <span className="hidden sm:inline">Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-[var(--surface)] to-accent-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
        <div className="relative mx-auto w-full max-w-[19rem] px-4 py-20 text-center sm:max-w-6xl sm:px-6 sm:py-32">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 text-sm text-primary-700 font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Gift Recommendations
          </div>
          <h1 className="mx-auto max-w-sm text-3xl font-bold leading-tight text-text-primary sm:max-w-4xl sm:text-6xl">
            What should you{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500 sm:inline">
              get them?
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[19rem] text-lg leading-relaxed text-text-secondary sm:max-w-2xl sm:text-xl">
            Describe someone in your own words and get hyper-specific gift ideas
            that show you truly know them. No more candles and scarves.
          </p>
          <div className="mx-auto mt-10 flex w-full max-w-[19rem] flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-200 transition-colors hover:bg-primary-700 sm:w-auto sm:px-8"
            >
              <Sparkles className="h-5 w-5" />
              Start Finding Gifts
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 text-base font-medium text-text-secondary transition-colors hover:bg-surface-secondary sm:w-auto sm:px-8"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-16 bg-surface-secondary border-y border-border">
        <div className="mx-auto w-full max-w-[19rem] px-4 sm:max-w-4xl sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-[var(--card-bg)] shadow-lg">
            <div className="p-6 border-b border-border bg-surface-secondary">
              <p className="text-sm text-text-tertiary mb-2">You type:</p>
              <p className="break-words text-text-primary italic">
                &ldquo;My friend who just got into pottery but is intimidated by
                the studio, loves weird podcasts, and has a cat named Chairman
                Meow.&rdquo;
              </p>
            </div>
            <div className="p-6">
              <p className="text-sm text-text-tertiary mb-3">
                Gift Whisperer suggests:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: 'Home Pottery Kit with "The Ceramics Bible"',
                    why: "Perfect for a beginner who wants to practice in their comfort zone before hitting the studio",
                    price: "$45-$65",
                    category: "hobby-gear",
                  },
                  {
                    title: "Chairman Meow Custom Cat Portrait",
                    why: "A hand-illustrated portrait of their cat, because that name deserves to be immortalized",
                    price: "$30-$60",
                    category: "handmade",
                  },
                  {
                    title: "Podcast Microphone Starter Kit",
                    why: "For someone who loves weird podcasts so much they might want to start their own",
                    price: "$50-$80",
                    category: "tech",
                  },
                ].map((gift) => (
                  <div
                    key={gift.title}
                    className="flex min-w-0 items-start gap-3 rounded-lg bg-surface-secondary p-3"
                  >
                    <Gift className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary text-sm">
                        {gift.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {gift.why}
                      </p>
                      <p className="text-xs text-primary-600 font-medium mt-1">
                        {gift.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "1. Describe Them",
                description:
                  "Tell us about the person in your own words. Their hobbies, quirks, inside jokes, life stage — anything that makes them who they are.",
              },
              {
                icon: Sparkles,
                title: "2. AI Generates Ideas",
                description:
                  "Our AI thinks laterally — connecting personality traits, interests, and circumstances to find gifts that are specific, creative, and meaningful.",
              },
              {
                icon: ShoppingBag,
                title: "3. Find & Give",
                description:
                  "Browse personalized suggestions with price estimates and one-click search links. Save favorites, track what you've given, and never repeat a gift.",
              },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
                  <step.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            More Than Suggestions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Recipient Profiles",
                description:
                  "Save people you buy gifts for. Their interests, personality, and important dates — all in one place.",
              },
              {
                icon: Clock,
                title: "Gift History",
                description:
                  "Track what you've given to who. Never accidentally repeat a gift. Rate how well they were received.",
              },
              {
                icon: Zap,
                title: "Instant Ideas",
                description:
                  "Get 5 hyper-specific gift ideas in seconds. Not generic — each one explains why it's perfect for your person.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-[var(--card-bg)] p-6"
              >
                <feature.icon className="h-6 w-6 text-primary-500 mb-3" />
                <h3 className="font-semibold text-text-primary mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Ready to find the perfect gift?
          </h2>
          <p className="text-text-secondary mb-8">
            Free to use. No credit card required. Just describe someone and let
            AI do the thinking.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-200 transition-colors hover:bg-primary-700"
          >
            <Gift className="h-5 w-5" />
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Gift className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-text-primary">
              Gift Whisperer
            </span>
          </div>
          <p className="text-xs text-text-tertiary">
            Made with care. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
