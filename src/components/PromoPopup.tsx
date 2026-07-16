"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SEEN_KEY = "omc:promo:v1";
const PROMO_CODE = "WELCOME25";

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [copied, setCopied] = useState(false);

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

  function copyCode() {
    try {
      navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
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
            <p className="label text-mute">One Mission</p>
            <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
              25% off your<br />first order
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              Join the list for early access to drops, restocks, and 25% off today.
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
              {status === "sending" ? "One sec…" : "Unlock 25% off"}
            </button>
            <button type="button" onClick={dismiss} className="mt-3 text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink">
              No thanks
            </button>
          </form>
        ) : (
          <div className="px-8 py-12 text-center">
            <p className="label text-mute">You&apos;re in</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-ink sm:text-3xl">Here&apos;s 25% off</h2>
            <p className="mt-2 text-sm text-ink/70">Use this code at checkout — it&apos;s good for your first order.</p>
            <button
              onClick={copyCode}
              className="mx-auto mt-6 flex items-center justify-center gap-3 border border-ink px-6 py-4 text-lg font-semibold tracking-[0.2em] text-ink hover:bg-ink hover:text-paper"
            >
              {PROMO_CODE}
              <span className="text-[10px] uppercase tracking-[0.18em]">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button onClick={dismiss} className="mt-6 block w-full bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper hover:opacity-90">
              Shop now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
