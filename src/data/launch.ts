/**
 * FOUNDERS COLLECTION — LAUNCH CLOCK
 *
 * Single source of truth for the drop. The countdown on the home page and the
 * buy buttons on every product page both read from here, so the store opens
 * itself the moment the clock hits zero — no redeploy needed.
 *
 * July 27, 2026 at 8:00 AM Central. Central is on daylight time in July
 * (CDT = UTC-5), so 8:00 AM Central === 13:00 UTC.
 *
 * OWNER PREVIEW BYPASS
 * --------------------
 * Visit any page once with  ?preview=omc-preview-2026  (e.g.
 * https://onemissioncollection.com/?preview=omc-preview-2026 ) and THIS browser
 * unlocks the full store early — you can add to cart and check out for real
 * before launch. The flag is saved in this browser only; every other visitor
 * still sees the pre-launch gate until LAUNCH_AT. To turn it off, run
 * localStorage.removeItem("omc_preview") in the console, or use a private window.
 */
export const LAUNCH_AT = Date.parse("2026-07-27T13:00:00Z");

/** Secret token that unlocks the store early for the owners' own browser. */
const PREVIEW_TOKEN = "omc-preview-2026";

/** True while the drop has not opened yet (unless this browser has preview access). */
export function isPreLaunch(now: number = Date.now()): boolean {
  // Client-side owner bypass — never affects the public server render.
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === PREVIEW_TOKEN) {
        localStorage.setItem("omc_preview", PREVIEW_TOKEN);
      }
      if (localStorage.getItem("omc_preview") === PREVIEW_TOKEN) return false;
    } catch {
      /* localStorage/URL unavailable — fall through to the normal time gate */
    }
  }
  return now < LAUNCH_AT;
}

/** Remaining time, broken out for the countdown display. */
export function timeLeft(now: number = Date.now()) {
  const ms = Math.max(0, LAUNCH_AT - now);
  const s = Math.floor(ms / 1000);
  return {
    total: ms,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export const LAUNCH_LABEL = "July 27 · 8:00 AM CT";
