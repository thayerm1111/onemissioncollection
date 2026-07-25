"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type Review = {
  author_name: string;
  location?: string | null;
  rating: number;
  title?: string | null;
  body: string;
  created_at: string;
};

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= value ? "fill-ink text-ink" : "text-line"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

export function ProductReviews({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle?: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  useEffect(() => {
    let alive = true;
    fetch(`/api/reviews?product=${encodeURIComponent(productId)}`)
      .then((r) => r.json())
      .then((d) => { if (alive) { setReviews(Array.isArray(d.reviews) ? d.reviews : []); setLoaded(true); } })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, [productId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) { setError("Please choose a star rating."); return; }
    if (!name.trim() || body.trim().length < 4) { setError("Please add your name and a few words."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, author_name: name, location, rating, title, body, website }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { setSent(true); setOpen(false); }
      else setError(d.error || "Could not submit right now.");
    } catch {
      setError("Could not submit right now.");
    } finally {
      setBusy(false);
    }
  }

  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;

  return (
    <section className="mx-auto max-w-site px-5 py-16 sm:px-8">
      <div className="border-t border-line pt-12">
        <div className="label text-mute">The Movement</div>
        <h2 className="mt-3 text-2xl uppercase tracking-widest2 text-ink sm:text-3xl">
          Reviews &amp; Stories
        </h2>

        {/* Founder's note — the authentic anchor of social proof */}
        <figure className="mt-8 border border-line rounded-lg p-6 sm:p-8">
          <div className="label text-mute">From our founder</div>
          <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/90 sm:text-base">
            &ldquo;One Mission started because I know what it feels like to be the one who
            wandered off &mdash; lost, searching, sure everyone else had it figured out. This
            isn&rsquo;t just clothing. Every piece is a reminder that you were worth leaving the
            ninety-nine for. When you wear it, you&rsquo;re carrying that message &mdash; and
            you&rsquo;re part of a family that went looking for you.&rdquo;
          </blockquote>
          <figcaption className="mt-5 text-[12px] uppercase tracking-wider2 text-mute">
            &mdash; Matthew, Founder &middot; Matthew 18:13
          </figcaption>
        </figure>

        {/* Summary + write button */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {count > 0 ? (
              <>
                <Stars value={Math.round(avg)} size={16} />
                <span className="text-sm text-ink">{avg.toFixed(1)}</span>
                <span className="text-sm text-mute">
                  {count} {count === 1 ? "review" : "reviews"}
                </span>
              </>
            ) : (
              <span className="text-sm text-mute">
                Be the first to share your story about {productTitle || "this piece"}.
              </span>
            )}
          </div>
          <button
            onClick={() => { setOpen((v) => !v); setSent(false); }}
            className="border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Write a review
          </button>
        </div>

        {sent && (
          <p className="mt-6 rounded-md border border-line bg-paper/50 p-4 text-sm text-ink">
            Thank you for sharing. Your review will appear here once it&rsquo;s approved.
          </p>
        )}

        {/* Review form */}
        {open && (
          <form onSubmit={submit} className="mt-6 grid gap-4 rounded-lg border border-line p-6">
            <div className="flex items-center gap-3">
              <span className="label text-mute">Your rating</span>
              <span className="inline-flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(i)}
                    aria-label={`${i} star${i > 1 ? "s" : ""}`}
                    className="p-0.5"
                  >
                    <Star
                      size={22}
                      className={i <= (hover || rating) ? "fill-ink text-ink" : "text-line"}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" required maxLength={60}
                className="border border-line bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-mute focus:border-ink focus:outline-none"
              />
              <input
                value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="City / State (optional)" maxLength={60}
                className="border border-line bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-mute focus:border-ink focus:outline-none"
              />
            </div>

            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Headline (optional)" maxLength={120}
              className="border border-line bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-mute focus:border-ink focus:outline-none"
            />
            <textarea
              value={body} onChange={(e) => setBody(e.target.value)}
              placeholder="Tell others about the fit, the quality, and what wearing it means to you." required rows={4} maxLength={2000}
              className="border border-line bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-mute focus:border-ink focus:outline-none"
            />

            {/* honeypot — hidden from humans */}
            <input
              value={website} onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1} autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit" disabled={busy}
                className="bg-ink px-6 py-2.5 text-[11px] uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Submitting…" : "Submit review"}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews list */}
        {count > 0 && (
          <ul className="mt-10 grid gap-8">
            {reviews.map((r, i) => (
              <li key={i} className="border-b border-line pb-8 last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <Stars value={r.rating} />
                  <span className="text-[11px] uppercase tracking-wider2 text-mute">
                    {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
                {r.title && <p className="mt-3 text-sm font-medium text-ink">{r.title}</p>}
                <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{r.body}</p>
                <p className="mt-3 text-[12px] uppercase tracking-wider2 text-mute">
                  {r.author_name}{r.location ? ` · ${r.location}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}

        {loaded && count === 0 && !open && !sent && (
          <p className="mt-8 text-sm text-mute">
            No reviews yet. Wear it, live in it, then come back and tell your story.
          </p>
        )}
      </div>
    </section>
  );
}
