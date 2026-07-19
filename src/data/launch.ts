/**
 * FOUNDERS COLLECTION — LAUNCH CLOCK
 *
 * Single source of truth for the drop. The countdown on the home page and the
 * buy buttons on every product page both read from here, so the store opens
 * itself the moment the clock hits zero — no redeploy needed.
 *
 * July 27, 2026 at 8:00 AM Central. Central is on daylight time in July
 * (CDT = UTC-5), so 8:00 AM Central === 13:00 UTC.
 */
export const LAUNCH_AT = Date.parse("2026-07-27T13:00:00Z");

/** True while the drop has not opened yet. */
export function isPreLaunch(now: number = Date.now()): boolean {
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
