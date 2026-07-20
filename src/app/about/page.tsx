"use client";

/**
 * ABOUT / THE SEARCH
 *
 * This page enacts Matthew 18:13 rather than describing it. The visitor
 * arrives as "the one" — ninety-nine marks scatter as they scroll, one
 * remains, and only then do the founders appear as the two who went looking.
 *
 * PLACEHOLDER CONTENT: the two testimonies in FOUNDERS below are written as
 * stand-ins. Replace `story` (and name/role/photo) with the real words.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ---------- deterministic scatter for the ninety-nine ---------- */
// Seeded so server and client render identically (no hydration mismatch).
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1813); // Matthew 18:13
const NINETY_NINE = Array.from({ length: 99 }, () => ({
  x: rand() * 100,          // vw %
  y: rand() * 100,          // vh %
  d: rand(),                // drift/stagger seed
  s: 2 + rand() * 3,        // size px
}));

/* ---------- the founders (REPLACE WITH REAL STORIES) ---------- */
const FOUNDERS = [
  {
    name: "Matthew Thayer",
    role: "Co-Founder",
    photo: "/founders/matthew.jpg",
    pull: "I was the one who wandered off.",
    story:
      "[PLACEHOLDER — replace with your real story.] There was a stretch where I had everything that was supposed to add up and none of it did. I kept moving so I wouldn't have to sit still with myself. What found me wasn't a program or a plan — it was somebody who refused to stop looking for me. That's the only reason I'm here. One Mission exists because I know what it costs to be the one nobody came back for, and I know what it's worth when somebody does.",
  },
  {
    name: "Joey Wilson",
    role: "Co-Founder",
    photo: "/founders/joey.jpg",
    pull: "Somebody came back for me. So I go back for others.",
    story:
      "[PLACEHOLDER — replace with Joey's real story.] I spent years believing I was too far gone to be worth the trip. I had built a version of myself that could function while being completely lost. The turning point wasn't dramatic — it was one person who kept showing up after I gave them every reason not to. This brand is me going back out. Every piece we make is a way of saying: you're not too far out. Somebody is still looking.",
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      setP(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // eased phases
  const scatter = Math.min(p / 0.55, 1);            // 99 fade + drift away
  const gather = Math.min(Math.max((p - 0.1) / 0.6, 0), 1); // the one centers
  const verse = Math.min(Math.max((p - 0.3) / 0.45, 0), 1);
  const closing = Math.min(Math.max((p - 0.78) / 0.22, 0), 1);

  return (
    <div className="bg-paper text-ink">
      {/* ============ 1. THE NINETY-NINE ============ */}
      <section ref={heroRef} className="relative h-[320vh] bg-ink">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* the ninety-nine */}
          <div className="absolute inset-0" aria-hidden>
            {NINETY_NINE.map((d, i) => {
              const dir = d.d * Math.PI * 2;
              const dist = scatter * (140 + d.d * 220);
              return (
                <span
                  key={i}
                  className="absolute rounded-full bg-paper"
                  style={{
                    left: `${d.x}%`,
                    top: `${d.y}%`,
                    width: d.s,
                    height: d.s,
                    opacity: (1 - scatter) * 0.55,
                    transform: `translate(${Math.cos(dir) * dist}px, ${Math.sin(dir) * dist}px)`,
                    transition: "opacity 120ms linear",
                  }}
                />
              );
            })}
          </div>

          {/* the one */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%,-50%) translate(${(1 - gather) * 34}vw, ${(1 - gather) * 26}vh) scale(${0.35 + gather * 0.65})`,
            }}
            aria-hidden
          >
            <span
              className="block rounded-full bg-paper"
              style={{
                width: 14,
                height: 14,
                boxShadow: `0 0 ${18 + gather * 70}px ${6 + gather * 26}px rgba(255,255,255,${0.10 + gather * 0.30})`,
              }}
            />
          </div>

          {/* verse */}
          <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
            <p
              className="text-[11px] uppercase tracking-[0.4em] text-paper/50"
              style={{ opacity: verse }}
            >
              Matthew 18:13
            </p>
            <blockquote
              className="mt-7 text-balance text-2xl leading-[1.5] text-paper sm:text-4xl sm:leading-[1.45]"
              style={{ opacity: verse, transform: `translateY(${(1 - verse) * 18}px)` }}
            >
              &ldquo;If he finds it, truly I tell you, he rejoices more over that
              one sheep than over the ninety-nine that did not wander off.&rdquo;
            </blockquote>
            <p
              className="mt-10 text-sm uppercase tracking-widest2 text-paper sm:text-base"
              style={{ opacity: closing, transform: `translateY(${(1 - closing) * 14}px)` }}
            >
              We left the ninety-nine.
              <br className="sm:hidden" /> We&apos;re looking for you.
            </p>
          </div>

          {/* scroll cue */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-paper/40"
            style={{ opacity: 1 - Math.min(p * 4, 1) }}
          >
            Scroll
          </div>
        </div>
      </section>

      {/* ============ 2. YOU ARE THE ONE ============ */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center sm:py-40">
        <Eyebrow>You Are the One</Eyebrow>
        <h2 className="mt-6 text-3xl uppercase leading-tight tracking-widest2 sm:text-5xl">
          This was never about clothes
        </h2>
        <div className="mx-auto mt-10 max-w-xl space-y-6 text-[16px] leading-[1.85] text-ink/80">
          <p>
            Maybe you&apos;re tired in a way sleep doesn&apos;t touch. Maybe
            you&apos;re holding something you&apos;ve never said out loud. Maybe
            you&apos;re rebuilding, or ashamed, or just quietly wondering if
            anyone would come looking if you drifted far enough.
          </p>
          <p className="text-ink">
            You&apos;re the one. That&apos;s the whole point.
          </p>
          <p>
            The shepherd doesn&apos;t do math. He doesn&apos;t weigh ninety-nine
            against one and call it a good trade. He leaves. He goes out into
            the dark. And he does not stop walking until he&apos;s carrying you
            home.
          </p>
        </div>
      </section>

      {/* ============ 3. THE TWO WHO WENT LOOKING ============ */}
      <section className="border-t border-line bg-stone px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-site">
          <div className="text-center">
            <Eyebrow>The Two Who Went Looking</Eyebrow>
            <h2 className="mt-5 text-2xl uppercase tracking-widest2 sm:text-4xl">
              We were found first
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-mute">
              We don&apos;t run this from the outside looking in. We were the
              ones out there.
            </p>
          </div>

          <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-10">
            {FOUNDERS.map((f) => (
              <article key={f.name} className="flex flex-col">
                <div className="mb-7 aspect-[4/5] w-full overflow-hidden bg-ink/5">
                  {f.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.photo} alt={f.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-mute">
                        Portrait
                      </span>
                    </div>
                  )}
                </div>
                <blockquote className="text-xl leading-snug text-ink sm:text-2xl">
                  &ldquo;{f.pull}&rdquo;
                </blockquote>
                <p className="mt-6 text-[15px] leading-[1.85] text-ink/75">{f.story}</p>
                <div className="mt-7 border-t border-line pt-4">
                  <p className="text-[13px] uppercase tracking-wider2 text-ink">{f.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest2 text-mute">{f.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. WHY CLOTHING ============ */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center sm:py-36">
        <Eyebrow>Why Clothing</Eyebrow>
        <h2 className="mt-6 text-2xl uppercase leading-tight tracking-widest2 sm:text-4xl">
          The garment is the invitation
        </h2>
        <div className="mx-auto mt-10 max-w-xl space-y-6 text-[16px] leading-[1.85] text-ink/80">
          <p>
            People asked why we didn&apos;t just start a nonprofit. Because a
            nonprofit waits for people to walk in. Clothing goes out.
          </p>
          <p>
            It goes to the gas station at 11pm. The gym. The waiting room. The
            back of a class. Somebody reads your back in line and asks what it
            means — and now you&apos;re having the conversation nobody scheduled.
          </p>
          <p className="text-ink">
            We make the invitation. You&apos;re the one who carries it.
          </p>
        </div>
      </section>

      {/* ============ 5. THE MISSION IN PRACTICE ============ */}
      <section className="border-y border-line px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-site">
          <div className="text-center">
            <Eyebrow>The Mission in Practice</Eyebrow>
            <h2 className="mt-5 text-2xl uppercase tracking-widest2 sm:text-3xl">
              Words are cheap. Here&apos;s the work.
            </h2>
          </div>
          {/* PLACEHOLDER — replace with real numbers, partners, and outcomes. */}
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              { k: "Every order", v: "Funds the search", d: "A portion of every piece goes directly to outreach for people in crisis. [Replace with your real % and where it goes.]" },
              { k: "Boots on ground", v: "Real partners", d: "We work alongside people already doing the hard, unglamorous work of finding the one. [Name your partners here.]" },
              { k: "The Inner Circle", v: "Nobody walks alone", d: "Being found is the start, not the finish. Our members get teaching, resources, and people who keep showing up." },
            ].map((s) => (
              <div key={s.k} className="text-center">
                <p className="text-[11px] uppercase tracking-widest2 text-mute">{s.k}</p>
                <p className="mt-3 text-lg uppercase tracking-wider2 text-ink">{s.v}</p>
                <p className="mx-auto mt-4 max-w-xs text-[14px] leading-relaxed text-mute">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. WHO'S YOUR ONE → FOUNDERS COLLECTION ============ */}
      <section className="bg-ink px-6 py-28 text-center text-paper sm:py-36">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-paper/50">
            Now the question turns
          </p>
          <h2 className="mt-7 text-3xl uppercase leading-tight tracking-widest2 sm:text-5xl">
            Who&apos;s your one?
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-[16px] leading-[1.85] text-paper/70">
            Somebody came back for you. There&apos;s a name you thought of while
            you read this. Go get them.
          </p>

          <div className="mx-auto mt-16 max-w-xl border border-paper/20 px-7 py-10 sm:px-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-paper/50">
              The Drop
            </p>
            <h3 className="mt-4 text-2xl uppercase tracking-widest2 sm:text-3xl">
              The Founders Collection
            </h3>
            <p className="mx-auto mt-5 max-w-sm text-[14px] leading-relaxed text-paper/70">
              The pieces we built from our own stories. Wear the mission, start
              the conversation, go back for the one.
            </p>
            <Link
              href="/featured"
              className="mt-8 inline-flex items-center gap-2 bg-paper px-8 py-4 text-xs uppercase tracking-widest2 text-ink transition-opacity hover:opacity-90"
            >
              Shop the Founders Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-10 text-[13px] text-paper/50">
            Or{" "}
            <Link href="/inner-circle" className="border-b border-paper/40 pb-0.5 text-paper hover:opacity-70">
              join the search
            </Link>{" "}
            inside the Inner Circle.
          </p>
        </div>
      </section>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.35em] text-mute">{children}</div>
  );
}
