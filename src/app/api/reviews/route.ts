import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Customer reviews for product pages. Submissions land as 'pending' (RLS-
// enforced) and are invisible until approved in Supabase — so the public form
// can never publish spam or abuse straight to the storefront.
const SUPABASE_URL = "https://lqhagjirnjzlivdaiwwl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y4kFZfS8AkpthfvSQgYx-Q_B0_zj4mO";
const REST = `${SUPABASE_URL}/rest/v1/omc_reviews`;
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

const clip = (s: unknown, n: number) => String(s ?? "").trim().slice(0, n);

// GET /api/reviews?product=<pid> -> approved reviews for that product (newest first)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const product = clip(url.searchParams.get("product"), 40);
  if (!product) return NextResponse.json({ reviews: [] });
  try {
    const q = `${REST}?product_id=eq.${encodeURIComponent(product)}&status=eq.approved&order=created_at.desc&select=author_name,location,rating,title,body,created_at`;
    const res = await fetch(q, { headers: HEADERS, cache: "no-store" });
    const reviews = res.ok ? await res.json() : [];
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

// POST /api/reviews -> submit a review (stored pending moderation)
export async function POST(req: Request) {
  let payload: Record<string, unknown> = {};
  try { payload = await req.json(); } catch { /* ignore */ }

  // Honeypot: real users never fill this hidden field. Bots do.
  if (clip(payload.website, 1)) return NextResponse.json({ ok: true });

  const author_name = clip(payload.author_name, 60);
  const location = clip(payload.location, 60) || null;
  const title = clip(payload.title, 120) || null;
  const body = clip(payload.body, 2000);
  const product_id = clip(payload.product_id, 40) || null;
  const rating = Math.round(Number(payload.rating));

  if (!author_name || !body || body.length < 4) {
    return NextResponse.json({ ok: false, error: "Please add your name and a few words." }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "Please choose a star rating." }, { status: 400 });
  }

  try {
    const res = await fetch(REST, {
      method: "POST",
      headers: { ...HEADERS, Prefer: "return=minimal" },
      // status omitted -> defaults to 'pending' (RLS also forbids anything else).
      body: JSON.stringify({ product_id, author_name, location, rating, title, body }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error(`[reviews] insert failed status=${res.status} ${t.slice(0, 160)}`);
      return NextResponse.json({ ok: false, error: "Could not submit right now." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(`[reviews] insert threw ${String(e).slice(0, 120)}`);
    return NextResponse.json({ ok: false, error: "Could not submit right now." }, { status: 502 });
  }
}
