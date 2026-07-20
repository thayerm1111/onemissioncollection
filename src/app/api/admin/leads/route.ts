import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Waitlist readout for the owners.
 *
 * Auth: the caller sends their Supabase access token as a Bearer token. We
 * verify it with Supabase to get their REAL email — an email sent by the
 * client is never trusted — and then check it against OWNERS. No new password
 * or secret to manage, and nothing sensitive is committed to the repo
 * (email addresses are not credentials).
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Who can read the waitlist. Add Joey's login email here when he has one. */
const OWNERS = [
  "thayerm1111@gmail.com",
  "support@onemissioncollection.com",
];

async function verifiedEmail(token: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const user = await res.json();
    return typeof user?.email === "string" ? user.email.toLowerCase() : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return NextResponse.json({ ok: false, error: "not signed in" }, { status: 401 });
  }

  const email = await verifiedEmail(token);
  if (!email) {
    return NextResponse.json({ ok: false, error: "invalid session" }, { status: 401 });
  }
  if (!OWNERS.includes(email)) {
    return NextResponse.json({ ok: false, error: "not authorized" }, { status: 403 });
  }

  // Service role bypasses RLS so we can read every row, not just our own.
  const key = SUPABASE_SERVICE || SUPABASE_ANON;
  if (!SUPABASE_URL || !key) {
    return NextResponse.json({ ok: false, error: "storage not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/omc_leads?select=*&order=created_at.desc&limit=5000`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `read failed (${res.status})` },
        { status: 502 },
      );
    }
    const rows = await res.json();
    return NextResponse.json({
      ok: true,
      count: Array.isArray(rows) ? rows.length : 0,
      rows,
      // If we're falling back to the anon key, row-level security may hide
      // rows and make a populated list look empty. The page uses this to say
      // so plainly rather than implying nobody has signed up.
      usingServiceKey: Boolean(SUPABASE_SERVICE),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
