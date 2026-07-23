import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live affiliate Command Center data from UpPromote (v2 API).
 * Verifies the caller's Supabase session, looks up their UpPromote affiliate
 * record by email, and returns referral link, coupon, level, and performance
 * (orders, sales, commissions). If no UPPROMOTE_API_KEY is set, returns
 * { connected: false } and the UI falls back to owner-set values.
 *
 * Set UPPROMOTE_API_KEY in Vercel (UpPromote → Settings → Integrations → API).
 */
const SUPABASE_URL = "https://lqhagjirnjzlivdaiwwl.supabase.co";
const SUPABASE_ANON = "sb_publishable_Y4kFZfS8AkpthfvSQgYx-Q_B0_zj4mO";
const UP_KEY = process.env.UPPROMOTE_API_KEY;
const UP_BASE = "https://aff-api.uppromote.com/api/v2";

async function verifiedEmail(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const u = await res.json();
    return typeof u?.email === "string" ? u.email : null;
  } catch {
    return null;
  }
}

async function up(path: string): Promise<{ data?: unknown[] } | null> {
  try {
    const res = await fetch(`${UP_BASE}${path}`, {
      headers: { Authorization: UP_KEY as string, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as { data?: unknown[] };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  const email = token ? await verifiedEmail(token) : null;
  if (!email) {
    return NextResponse.json({ connected: false, isAffiliate: false, error: "not signed in" }, { status: 401 });
  }
  if (!UP_KEY) return NextResponse.json({ connected: false, isAffiliate: false });

  const affRes = await up(`/affiliates?affiliate_email=${encodeURIComponent(email)}`);
  const a = (affRes?.data?.[0] ?? null) as Record<string, unknown> | null;
  if (!a) return NextResponse.json({ connected: true, isAffiliate: false });

  let orders = 0;
  let sales = 0;
  const refRes = await up(`/referrals?affiliate_email=${encodeURIComponent(email)}&per_page=100`);
  if (Array.isArray(refRes?.data)) {
    orders = refRes.data.length;
    sales = (refRes.data as Record<string, unknown>[]).reduce(
      (n, r) => n + (parseFloat(String(r.total_sales ?? "0")) || 0),
      0,
    );
  }

  const status = String(a.status ?? "");
  const coupons = a.coupons as string[] | undefined;
  return NextResponse.json({
    connected: true,
    isAffiliate: status === "active" || status === "approved",
    status,
    referralLink: (a.custom_affiliate_link as string) || (a.default_affiliate_link as string) || null,
    coupon: Array.isArray(coupons) ? (coupons[0] ?? null) : null,
    level: (a.program_name as string) || null,
    orders,
    sales,
    commissionApproved: Number(a.approved_amount ?? 0),
    commissionPending: Number(a.pending_amount ?? 0),
    commissionPaid: Number(a.paid_amount ?? 0),
  });
}
