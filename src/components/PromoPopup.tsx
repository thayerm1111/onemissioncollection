"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SEEN_KEY = "omc:promo:v1";

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  // Show once per browser, a couple seconds after the first visit.
  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === "1"; } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setOpen(false);
    try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !consent) return;
    setStatus("sending");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, consent, source: "popup-25" }),
      });
    } catch {
      // Storage is best-effort — the shopper still gets their code.
    }
    try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
    setStatus("done");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60" onClick={dismiss} />
      <div className="relative w-full max-w-md bg-paper text-ink shadow-2xl">
        <button onClick={dismiss} aria-label="Close" className="absolute right-3 top-3 text-mute hover:text-ink">
          <X className="h-5 w-5" />
        </button>

        {status !== "done" ? (
          <form onSubmit={submit} className="px-8 py-10 text-center">
            <p className="label text-mute">The Founders Collection</p>
            <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
              Get in before<br />the drop
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              A limited first release. July 27, 8am CT. Join the list and we&apos;ll tell you
              the moment it&apos;s live.
            </p>

            <div className="mt-6 space-y-3 text-left">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none placeholder:text-mute focus:border-ink"
              />
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none placeholder:text-mute focus:border-ink"
              />
            </div>

            <label className="mt-4 flex items-start gap-2 text-left text-[11px] leading-snug text-mute">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
              <span>Yes, sign me up for emails &amp; texts from One Mission. Consent isn&apos;t a condition of purchase. Msg &amp; data rates may apply.</span>
            </label>

            <button
              type="submit" disabled={!email || !consent || status === "sending"}
              className="mt-5 w-full bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {status === "sending" ? "One sec…" : "Join the list"}
            </button>
            <button type="button" onClick={dismiss} className="mt-3 text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink">
              No thanks
            </button>
          </form>
        ) : (
          <div className="px-8 py-12 text-center">
            <p className="label text-mute">You&apos;re in</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              We&apos;ll come find you
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              You&apos;re on the list for the Founders Collection. We&apos;ll reach out
              the morning it drops — July 27, 8am CT.
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-mute">
              Matthew 18:13
            </p>
            <a href="/featured" onClick={dismiss} className="mt-8 block w-full bg-ink px-6 py-4 text-center text-xs uppercase tracking-widest2 text-paper hover:opacity-90">
              Preview the collection
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
