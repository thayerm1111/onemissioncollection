import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Captures a marketing opt-in (email + phone) from the promo popup.
// Persistence is best-effort: if the Supabase env vars are configured in Vercel
// the lead is written to the `omc_leads` table; otherwise we still return the
// code so the shopper's experience is never blocked.
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const consent = Boolean(body.consent);
  const source = String(body.source ?? "popup");

  if (!email) {
    return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      await fetch(`${url}/rest/v1/omc_leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify([{ email, phone, consent, source }]),
      });
    } catch {
      // Swallow storage errors — never block the shopper from getting the code.
    }
  }

  return NextResponse.json({ ok: true, code: "WELCOME25" });
}
