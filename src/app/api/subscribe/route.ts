import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Marketing opt-in from the promo popup (email + phone + consent).
// Persistence is layered and best-effort so the shopper ALWAYS gets their code:
//  1. If Shopify Admin creds are set, create the customer with email-marketing
//     consent (leads flow into Shopify + the VIP tools).
//  2. Else if Supabase creds are set, insert into the `omc_leads` table.
//  3. Regardless, return the code so the popup never blocks.
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "1-mission-2.myshopify.com";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN; // Admin API access token (write_customers)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

async function createShopifyCustomer(email: string, phone: string) {
  const mutation = `mutation($input: CustomerInput!){ customerCreate(input:$input){ customer{ id } userErrors{ message } } }`;
  const input: Record<string, unknown> = {
    email,
    tags: ["popup-25", "newsletter"],
    emailMarketingConsent: { marketingState: "SUBSCRIBED", marketingOptInLevel: "SINGLE_OPT_IN" },
  };
  if (phone) input.phone = phone;
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN as string,
    },
    body: JSON.stringify({ query: mutation, variables: { input } }),
  });
  return res.ok;
}

async function insertSupabase(email: string, phone: string, consent: boolean, source: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/omc_leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY as string,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify([{ email, phone, consent, source }]),
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const consent = Boolean(body.consent);
  const source = String(body.source ?? "popup");

  if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });

  try {
    if (ADMIN_TOKEN) {
      await createShopifyCustomer(email, phone);
    } else if (SUPABASE_URL && SUPABASE_KEY) {
      await insertSupabase(email, phone, consent, source);
    }
  } catch {
    // Never block the shopper from receiving their code.
  }

  return NextResponse.json({ ok: true, code: "WELCOME25" });
}
