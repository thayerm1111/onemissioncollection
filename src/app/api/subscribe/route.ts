import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Marketing opt-in from the promo popup (email + phone + consent).
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "1-mission-2.myshopify.com";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
// One Mission Collection's own Supabase project (separate from weare1mission).
// URL + publishable key are public and pinned so the waitlist insert lands in
// the OMC project regardless of any stale env pointing at the old shared one.
// Row-level security allows the publishable key to insert leads.
const SUPABASE_URL = "https://lqhagjirnjzlivdaiwwl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y4kFZfS8AkpthfvSQgYx-Q_B0_zj4mO";

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

/**
 * KLAVIYO — this is what actually lets us email people.
 *
 * Uses the *client* subscriptions endpoint, which authenticates with the
 * public company ID only. That value is not a secret (Klaviyo's own onsite
 * script exposes it in the browser), so it can live in the repo. No private
 * API key is involved and nothing sensitive is stored here.
 *
 * Subscribing someone to the list is what fires the welcome flow in Klaviyo.
 */
const KLAVIYO_COMPANY_ID = process.env.KLAVIYO_COMPANY_ID || "Yq65z5";
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID || "RQz65X"; // "Email List"

/** Klaviyo requires E.164 (+15551234567). Best-effort for US numbers. */
function toE164(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (!d) return null;
  if (raw.trim().startsWith("+")) return `+${d}`;
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return null; // unknown format — skip rather than send Klaviyo something invalid
}

async function subscribeKlaviyo(
  email: string, phone: string, name: string, source: string, smsConsent: boolean,
) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const e164 = toE164(phone);

  const profileAttrs: Record<string, unknown> = {
    email,
    properties: { source, signup_page: source },
  };
  if (first) profileAttrs.first_name = first;
  if (rest.length) profileAttrs.last_name = rest.join(" ");
  if (e164) profileAttrs.phone_number = e164;

  // This endpoint records email opt-in by definition, so consent is not passed
  // as a field. SMS is a separate legal opt-in (TCPA): we only hand Klaviyo the
  // phone number when the person explicitly ticked the SMS box, so a number
  // alone can never be turned into text marketing.
  if (!smsConsent) delete profileAttrs.phone_number;

  const payload = {
    data: {
      type: "subscription",
      attributes: {
        custom_source: source,
        profile: { data: { type: "profile", attributes: profileAttrs } },
      },
      relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
    },
  };

  const res = await fetch(
    `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(KLAVIYO_COMPANY_ID)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", revision: "2024-10-15" },
      body: JSON.stringify(payload),
    },
  );
  // Klaviyo returns 202 with an empty body on success.
  return { status: res.status, body: (await res.text()).slice(0, 300) };
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
  let klaviyo: unknown = null;
  let via = "none";
  try {
    // Klaviyo first — this is the one that makes the person reachable.
    if (KLAVIYO_COMPANY_ID && KLAVIYO_LIST_ID) {
      klaviyo = await subscribeKlaviyo(email, phone, name, source, smsConsent);
      via = "klaviyo";
    }
    if (ADMIN_TOKEN) {
      if (via === "none") via = "shopify";
      result = await createShopifyCustomer(email, phone, name, source);
    }
    // Always keep our own copy of the lead (name + SMS consent live here).
    if (SUPABASE_URL && SUPABASE_KEY) {
      const sb = await insertSupabase(email, phone, consent, source, name, smsConsent);
      if (via === "none") { via = "supabase"; }
      if (!result) result = sb;
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
      hasKlaviyo: Boolean(KLAVIYO_COMPANY_ID && KLAVIYO_LIST_ID),
      klaviyo,
      result,
    });
  }
  return NextResponse.json({ ok: true });
}
