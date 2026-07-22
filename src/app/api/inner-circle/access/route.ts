import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Inner Circle access check.
// Unlocks when the signed-in user has EITHER:
//   (a) purchased something from the store (a Shopify order on their email), OR
//   (b) been granted access (approved affiliate / manual grant) in
//       the omc_inner_circle_grants table.
//
// The request must carry the Supabase access token as a Bearer token. We verify
// it with Supabase to get the user's REAL email (never trust an email from the
// client), then run both checks with that email.

// OMC's own Supabase project (public URL + publishable key, pinned).
const SUPABASE_URL = "https://lqhagjirnjzlivdaiwwl.supabase.co";
const SUPABASE_ANON = "sb_publishable_Y4kFZfS8AkpthfvSQgYx-Q_B0_zj4mO";
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "1-mission-2.myshopify.com";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

async function verifiedEmail(token: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const user = await res.json();
    return typeof user?.email === "string" ? user.email : null;
  } catch {
    return null;
  }
}

async function hasGrant(token: string): Promise<boolean> {
  // RLS lets a user read only their own grant row (matched on their JWT email).
  if (!SUPABASE_URL || !SUPABASE_ANON) return false;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/omc_inner_circle_grants?select=email&limit=1`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return false; // table missing or blocked → no grant
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

async function hasPurchase(email: string): Promise<boolean> {
  if (!ADMIN_TOKEN) return false;
  const q = `query($q: String!){ orders(first: 1, query: $q){ edges { node { id } } } }`;
  try {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({ query: q, variables: { q: `email:${email}` } }),
      cache: "no-store",
    });
    if (!res.ok) return false;
    const json = await res.json();
    const edges = json?.data?.orders?.edges;
    return Array.isArray(edges) && edges.length > 0;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!token) {
    return NextResponse.json({ allowed: false, reason: null, error: "not signed in" }, { status: 401 });
  }

  const email = await verifiedEmail(token);
  if (!email) {
    return NextResponse.json({ allowed: false, reason: null, error: "invalid session" }, { status: 401 });
  }

  const [grant, purchase] = await Promise.all([hasGrant(token), hasPurchase(email)]);

  const reason = grant ? "affiliate" : purchase ? "purchase" : null;
  return NextResponse.json({ allowed: Boolean(reason), reason });
}
