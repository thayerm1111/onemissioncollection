"use client";

/** v2 — founders waitlist route
 * FOUNDERS COLLECTION — WAITLIST  (Drop Strategy, Phase 1)
 *
 * The destination for paid ads. One job: capture Name + Email + Phone.
 * Per the strategy, this page does NOT sell the product — it sells the
 * mission, the identity, and the movement. No shop links, one action.
 *
 * SMS opt-in is a separate, explicit checkbox (TCPA) so the Klaviyo SMS
 * list only ever contains people who actually agreed to texts.
 */

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function FoundersWaitlistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone,
          consent: true,
          smsConsent: smsConsent && Boolean(phone.trim()),
          source: "founders-waitlist",
        }),
      });
      if (!r.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setErr("Something went wrong. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-ink text-paper">
      {/* ---------- HERO + FORM ---------- */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-20 text-center sm:pt-28">
        <p className="text-[11px] uppercase tracking-[0.4em] text-paper/50">
          The Founders Collection
        </p>
        <h1 className="mx-auto mt-7 max-w-2xl text-4xl uppercase leading-[1.1] tracking-widest2 sm:text-6xl">
          For the ones
          <br /> who felt lost
        </h1>
        <p className="mx-auto mt-7 max-w-lg text-[16px] leading-[1.8] text-paper/70">
          Built to remind you you&apos;re never beyond God&apos;s reach. Our
          first release — limited, numbered, and made for the one who wandered.
        </p>

        {done ? (
          <div className="mx-auto mt-12 max-w-md border border-paper/25 px-7 py-10">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-paper/30">
              <Check className="h-5 w-5" />
            </div>
            <p className="mt-6 text-lg uppercase tracking-widest2">You&apos;re on the list</p>
            <p className="mt-4 text-[14px] leading-relaxed text-paper/70">
              You&apos;ll get first access before anyone else — and the story
              behind every piece as we build it. Watch your inbox
              {smsConsent && phone ? " and your texts" : ""}.
            </p>
            <p className="mt-6 text-[13px] text-paper/50">
              Now go find your one.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-12 max-w-md text-left">
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest2 text-paper/50">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="mt-2 w-full border border-paper/25 bg-transparent px-4 py-3 text-[15px] text-paper outline-none placeholder:text-paper/30 focus:border-paper"
                placeholder="Your name"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-[11px] uppercase tracking-widest2 text-paper/50">Email</span>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-2 w-full border border-paper/25 bg-transparent px-4 py-3 text-[15px] text-paper outline-none placeholder:text-paper/30 focus:border-paper"
                placeholder="you@email.com"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-[11px] uppercase tracking-widest2 text-paper/50">
                Phone <span className="normal-case tracking-normal text-paper/35">(for drop alerts)</span>
              </span>
              <input
                type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className="mt-2 w-full border border-paper/25 bg-transparent px-4 py-3 text-[15px] text-paper outline-none placeholder:text-paper/30 focus:border-paper"
                placeholder="(555) 555-5555"
              />
            </label>

            {phone.trim() && (
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox" checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-white"
                />
                <span className="text-[12px] leading-relaxed text-paper/55">
                  Text me when the drop goes live. Message and data rates may
                  apply. Reply STOP to unsubscribe.
                </span>
              </label>
            )}

            {err && <p className="mt-4 text-[13px] text-paper">{err}</p>}

            <button
              type="submit" disabled={busy}
              className="mt-7 flex w-full items-center justify-center gap-2 bg-paper px-8 py-4 text-xs uppercase tracking-widest2 text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Joining…" : "Join the early access list"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="mt-4 text-center text-[12px] text-paper/40">
              No spam. Just the mission and the drop.
            </p>
          </form>
        )}
      </section>

      {/* ---------- WHY THIS EXISTS ---------- */}
      <section className="border-t border-paper/10 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-paper/45">
            Matthew 18:13
          </p>
          <blockquote className="mt-6 text-xl leading-[1.6] text-paper sm:text-2xl">
            &ldquo;If he finds it, truly I tell you, he rejoices more over that
            one sheep than over the ninety-nine that did not wander off.&rdquo;
          </blockquote>
          <p className="mx-auto mt-8 max-w-lg text-[15px] leading-[1.85] text-paper/70">
            The shepherd doesn&apos;t do the math. He leaves the ninety-nine and
            goes out into the dark for the one. That&apos;s the entire reason
            this brand exists — and the reason we made this collection.
          </p>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.85] text-paper/70">
            We were both the one. Somebody came back for us. Now we go back for
            others, and every piece we make is the invitation.
          </p>
        </div>
      </section>

      {/* ---------- WHAT THE LIST GETS ---------- */}
      <section className="border-t border-paper/10 px-6 py-20">
        <div className="mx-auto max-w-site">
          <p className="text-center text-[11px] uppercase tracking-[0.35em] text-paper/45">
            On the list, you get
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              { k: "01", t: "First access", d: "The list shops before the public does. When it opens, you're already in." },
              { k: "02", t: "The stories first", d: "Our stories, the design process, and the people this is built for — before anyone else sees them." },
              { k: "03", t: "The drop alert", d: "Email and text the moment it goes live. No refreshing, no guessing." },
            ].map((s) => (
              <div key={s.k} className="text-center">
                <p className="text-[11px] tracking-widest2 text-paper/35">{s.k}</p>
                <p className="mt-3 text-[15px] uppercase tracking-wider2">{s.t}</p>
                <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-paper/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SCARCITY ---------- */}
      <section className="border-t border-paper/10 px-6 py-20 text-center">
        <h2 className="mx-auto max-w-xl text-2xl uppercase leading-tight tracking-widest2 sm:text-3xl">
          Limited first release
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-[1.8] text-paper/70">
          We&apos;re making a small run on purpose. When it&apos;s gone,
          it&apos;s gone — and the next chapter begins.
        </p>
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="mt-9 inline-flex items-center gap-2 border border-paper/40 px-8 py-4 text-xs uppercase tracking-widest2 text-paper hover:bg-paper hover:text-ink"
        >
          Join the list <ArrowRight className="h-4 w-4" />
        </a>
      </section>
    </div>
  );
}
