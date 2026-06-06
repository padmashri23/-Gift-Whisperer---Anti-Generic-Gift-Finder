import { Gift, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SharedGift {
  id: string;
  title: string;
  description: string;
  estimated_price_min: number;
  estimated_price_max: number;
  why_its_perfect: string;
  category: string;
  purchase_keywords: string[];
}

async function getSharedList(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/share/${token}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function SharedListPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getSharedList(token);

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--surface-secondary)] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <Gift className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h1 className="text-xl font-bold text-text-primary mb-2">
            List Not Found
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            This share link may have expired or been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Gift Whisperer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)]">
      <header className="border-b border-border bg-[var(--card-bg)]">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-3"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Gift className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-text-primary">
              Gift Whisperer
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">{data.title}</h1>
          {data.recipientName && (
            <p className="text-text-secondary mt-1">
              Gift ideas for {data.recipientName}
              {data.occasion ? ` · ${data.occasion}` : ""}
            </p>
          )}
          {data.description && (
            <p className="text-sm text-text-tertiary mt-2">
              {data.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.gifts.map((gift: SharedGift) => (
            <div
              key={gift.id}
              className="rounded-xl border border-border bg-[var(--card-bg)] p-6 shadow-sm flex flex-col"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-text-primary leading-tight">
                    {gift.title}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium mt-1">
                    {formatPrice(gift.estimated_price_min)} -{" "}
                    {formatPrice(gift.estimated_price_max)}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 whitespace-nowrap">
                  {gift.category}
                </span>
              </div>

              <p className="text-sm text-text-secondary mb-3">
                {gift.description}
              </p>

              <div className="mb-4 rounded-lg bg-primary-50 px-3 py-2">
                <p className="text-sm text-primary-800">
                  <Star className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                  <span className="font-medium">Why it&apos;s perfect:</span>{" "}
                  {gift.why_its_perfect}
                </p>
              </div>

              <div className="mt-auto pt-3 border-t border-border">
                <p className="text-xs font-medium text-text-tertiary flex items-center gap-1 mb-2">
                  <ShoppingCart className="h-3 w-3" />
                  Find it online
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Amazon", "Flipkart", "Meesho"].map((store) => {
                    const query = encodeURIComponent(
                      gift.purchase_keywords.join(" ")
                    );
                    const urls: Record<string, string> = {
                      Amazon: `https://www.amazon.in/s?k=${query}`,
                      Flipkart: `https://www.flipkart.com/search?q=${query}`,
                      Meesho: `https://www.meesho.com/search?q=${query}`,
                    };
                    return (
                      <a
                        key={store}
                        href={urls[store]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary text-center hover:bg-surface-secondary transition-colors"
                      >
                        {store}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-text-tertiary mb-3">
            Want to find your own perfect gifts?
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <Gift className="h-4 w-4" />
            Try Gift Whisperer Free
          </Link>
        </div>
      </main>
    </div>
  );
}
