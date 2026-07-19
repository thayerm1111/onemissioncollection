"use client";

/**
 * COUNTDOWN HERO — the first thing anyone sees.
 *
 * Full-bleed model shot of the Founders Club Hoodie with a live countdown to
 * the drop. When the clock hits zero it flips itself to "The drop is live"
 * and points at the collection — no redeploy required.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LAUNCH_LABEL, isPreLaunch, timeLeft } from "@/data/launch";

const HERO_IMG =
  "https://cdn.shopify.com/s/files/1/1016/0406/5559/files/08ee07ff5cc34c9db2bdbfa390a4ee15.png?v=1784493957";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[68px] flex-col items-center sm:min-w-[92px]">
      <span className="font-mono text-4xl leading-none tabular-nums text-paper sm:text-6xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-paper/50 sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

export function CountdownHero() {
  // Start locked so the server render and first paint always show the
  // countdown; the effect corrects it immediately on the client.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const live = now !== null && !isPreLaunch(now);
  const t = timeLeft(now ?? undefined);

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-ink">
      {/* model shot */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMG}
        alt="The Founders Collection"
        className="absolute inset-0 h-full w-full object-cover object-top opacity-80"
      />
      {/* scrim for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/90" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-paper/60">
          The Founders Collection
        </p>

        <h1 className="mt-6 text-4xl uppercase leading-[1.05] tracking-widest2 text-paper sm:text-6xl">
          {live ? (
            <>The drop
              <br /> is live</>
          ) : (
            <>For the ones
              <br /> who felt lost</>
          )}
        </h1>

        {live ? (
          <>
            <p className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-paper/70">
              2,500 pieces. Once they&apos;re gone, they&apos;re gone.
            </p>
            <Link
              href="/featured"
              className="mt-10 inline-flex items-center gap-2 bg-paper px-10 py-4 text-xs uppercase tracking-widest2 text-ink transition-opacity hover:opacity-90"
            >
              Shop the drop <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <p className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-paper/70">
              Our first release. Limited to 500 of each piece.
            </p>

            {/* countdown */}
            <div className="mt-12 flex items-start justify-center gap-3 sm:gap-8">
              <Unit value={t.days} label="Days" />
              <span className="pt-1 font-mono text-3xl text-paper/25 sm:pt-0 sm:text-5xl">:</span>
              <Unit value={t.hours} label="Hours" />
              <span className="pt-1 font-mono text-3xl text-paper/25 sm:pt-0 sm:text-5xl">:</span>
              <Unit value={t.minutes} label="Min" />
              <span className="pt-1 font-mono text-3xl text-paper/25 sm:pt-0 sm:text-5xl">:</span>
              <Unit value={t.seconds} label="Sec" />
            </div>

            <p className="mt-7 text-[11px] uppercase tracking-[0.3em] text-paper/50">
              {LAUNCH_LABEL}
            </p>

            <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/founders"
                className="inline-flex items-center gap-2 bg-paper px-9 py-4 text-xs uppercase tracking-widest2 text-ink transition-opacity hover:opacity-90"
              >
                Get early access <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/featured"
                className="inline-flex items-center gap-2 border border-paper/40 px-9 py-4 text-xs uppercase tracking-widest2 text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Preview the collection
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
