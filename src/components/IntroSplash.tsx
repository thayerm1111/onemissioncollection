"use client";

import { useEffect, useState } from "react";

/**
 * First-visit intro: a shopping bag with the One Mission Collection mark.
 * Shows once (remembered via localStorage), then fades to reveal the store.
 */
export function IntroSplash() {
  const [phase, setPhase] = useState<"hidden" | "in" | "out">("hidden");

  useEffect(() => {
    try {
      if (localStorage.getItem("omc_intro_seen")) return;
    } catch {
      /* private mode — just show it */
    }
    setPhase("in");
    const t1 = setTimeout(() => setPhase("out"), 2300);
    const t2 = setTimeout(() => {
      setPhase("hidden");
      try {
        localStorage.setItem("omc_intro_seen", "1");
      } catch {
        /* ignore */
      }
    }, 3050);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink transition-opacity duration-700 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center justify-center" style={{ animation: "omcRise 900ms cubic-bezier(.2,.7,.2,1) both" }}>
        <svg width="240" height="264" viewBox="0 0 240 264" fill="none" className="text-paper">
          {/* handles */}
          <path
            d="M88 66 V48 a32 32 0 0 1 64 0 V66"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* bag body */}
          <path
            d="M50 66 H190 L179 236 a9 9 0 0 1 -9 8 H70 a9 9 0 0 1 -9 -8 Z"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
        {/* wordmark on the bag face */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-10 text-paper">
          <span style={{ fontSize: 11, letterSpacing: "0.24em" }}>ONE MISSION</span>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.22em" }}>COLLECTION</span>
        </div>
      </div>
      <style>{`
        @keyframes omcRise {
          0% { opacity: 0; transform: translateY(20px) scale(.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
