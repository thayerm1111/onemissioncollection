import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Marketing opt-in from the promo popup (email + phone + consent).
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "1-mission-2.myshopify.com";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

async function createShopifyCustomer(email: string, phone: string, name = "", source = "popup") {
  const mutation = `mutation($input: CustomerInput!){ customerCreate(input:$input){ customer{ id } userErrors{ message } } }`;
  const tags = source === "founders-waitlist"
    ? ["founders-waitlist", "drop-early-access", "newsletter"]
    : ["popup-25", "newsletter"];
  const input: Record<string, unknown> = {
    email,
    tags,
    emailMarketingConsent: { marketingState: "SUBSCRIBED", marketingOptInLevel: "SINGLE_OPT_IN" },
  };
  const [first, ...rest] = name.trim().split(/\s+/);
  if (first) input.firstName = first;
  if (rest.length) input.lastName = rest.join(" ");
  if (phone) input.phone = phone;
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-07/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ADMIN_TOKEN as string },
    body: JSON.stringify({ query: mutation, variables: { input } }),
  });
  return { status: res.status, body: await res.text() };
}

async function insertSupabase(
  email: string, phone: string, consent: boolean, source: string,
  name = "", smsConsent = false,
) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/omc_leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY as string,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify([{ email, phone, consent, source, name, sms_consent: smsConsent }]),
  });
  return { status: res.status, body: await res.text() };
}

export async function POST(req: Request) {
  const debug = new URL(req.url).searchParams.has("debug");
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const consent = Boolean(body.consent);
  const source = String(body.source ?? "popup");
  const name = String(body.name ?? "").trim();
  // SMS marketing needs its own explicit opt-in (TCPA) — never inferred.
  const smsConsent = Boolean(body.smsConsent);

  if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });

  let result: unknown = null;
  let via = "none";
  try {
    if (ADMIN_TOKEN) {
      via = "shopify";
      result = await createShopifyCustomer(email, phone, name, source);
    }
    // Always keep our own copy of the lead (name + SMS consent live here).
    if (SUPABASE_URL && SUPABASE_KEY) {
      const sb = await insertSupabase(email, phone, consent, source, name, smsConsent);
      if (via === "none") { via = "supabase"; result = sb; }
    }
  } catch (e) {
    result = { error: String(e) };
  }

  if (debug) {
    return NextResponse.json({
      ok: true, via,
      hasSupabaseUrl: Boolean(SUPABASE_URL),
      hasSupabaseKey: Boolean(SUPABASE_KEY),
      hasAdminToken: Boolean(ADMIN_TOKEN),
      result,
    });
  }
  return NextResponse.json({ ok: true });
}
