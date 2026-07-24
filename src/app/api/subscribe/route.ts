import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Marketing opt-in from the promo popup / founders waitlist (email + phone + consent).
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "1-mission-2.myshopify.com";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
// One Mission Collection's own Supabase project (separate from weare1mission).
// URL + publishable key are public and pinned so the waitlist insert lands in
// the OMC project regardless of any stale env. RLS allows the publishable key
// to insert/select leads only.
const SUPABASE_URL = "https://lqhagjirnjzlivdaiwwl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y4kFZfS8AkpthfvSQgYx-Q_B0_zj4mO";

// Only the owner-known token unlocks the diagnostic view. Without it, ?debug
// returns nothing revealing — closes the config-recon leak flagged pre-launch.
const DEBUG_TOKEN = "omc-diag-2026";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normalizeEmail = (e: string) => e.trim().toLowerCase();

// Redacts nothing sensitive by construction, but scrubs any accidental token
// echo before it can reach a log line.
const scrub = (s: string) => s.replace(/shpat_[A-Za-z0-9]+/g, "[REDACTED]");

async function createShopifyCustomer(email: string, phone: string, name = "", source = "popup") {
  // customerCreate is idempotent at Shopify's layer (email is unique). We treat
  // an "already taken" userError as success rather than a failure.
  const mutation = `mutation($input: CustomerInput!){ customerCreate(input:$input){ customer{ id } userErrors{ field message } } }`;
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

  try {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-07/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ADMIN_TOKEN as string },
      body: JSON.stringify({ query: mutation, variables: { input } }),
    });
    const text = await res.text();
    let parsed: { data?: { customerCreate?: { customer?: { id?: string }; userErrors?: { message?: string }[] } } } = {};
    try { parsed = JSON.parse(text); } catch {}
    const errs = parsed?.data?.customerCreate?.userErrors ?? [];
    const created = parsed?.data?.customerCreate?.customer?.id ?? null;
    const alreadyExists = errs.some((e) => /taken|already|exists/i.test(e?.message || ""));
    if (!created && !alreadyExists && (res.status >= 400 || errs.length)) {
      // Real failure — log for launch-day visibility (no token, no PII beyond a hashless email domain).
      console.error(`[subscribe] shopify customer create failed status=${res.status} errs=${scrub(JSON.stringify(errs)).slice(0, 200)}`);
    }
    return { ok: Boolean(created) || alreadyExists, created: Boolean(created), alreadyExists, status: res.status };
  } catch (e) {
    console.error(`[subscribe] shopify customer create threw: ${scrub(String(e)).slice(0, 160)}`);
    return { ok: false, error: "shopify_unreachable" };
  }
}

/**
 * KLAVIYO — the client subscriptions endpoint authenticates with the public
 * company ID only (not a secret; Klaviyo's own onsite script exposes it). No
 * private key involved. Subscribing fires the welcome flow.
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

  // SMS is a separate legal opt-in (TCPA): only hand Klaviyo the phone when the
  // person explicitly ticked the SMS box.
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

  try {
    const res = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(KLAVIYO_COMPANY_ID)}`,
      { method: "POST", headers: { "Content-Type": "application/json", revision: "2024-10-15" }, body: JSON.stringify(payload) },
    );
    if (res.status >= 400) console.error(`[subscribe] klaviyo status=${res.status}`);
    return { ok: res.status < 400, status: res.status };
  } catch (e) {
    console.error(`[subscribe] klaviyo threw: ${String(e).slice(0, 120)}`);
    return { ok: false, error: "klaviyo_unreachable" };
  }
}

/** Does a lead with this (normalized) email already exist? Prevents duplicate rows. */
async function leadExists(email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/omc_leads?email=eq.${encodeURIComponent(email)}&select=email&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false; // on error, fall through to insert rather than silently drop the lead
  }
}

async function insertSupabase(
  email: string, phone: string, consent: boolean, source: string,
  name = "", smsConsent = false,
) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/omc_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify([{ email, phone, consent, source, name, sms_consent: smsConsent }]),
    });
    if (res.status >= 400) console.error(`[subscribe] supabase insert status=${res.status}`);
    return { ok: res.status < 400, status: res.status };
  } catch (e) {
    console.error(`[subscribe] supabase threw: ${String(e).slice(0, 120)}`);
    return { ok: false, error: "supabase_unreachable" };
  }
}

export async function POST(req: Request) {
  const debug = new URL(req.url).searchParams.get("debug") === DEBUG_TOKEN;
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  const rawEmail = String(body.email ?? "");
  const email = normalizeEmail(rawEmail);
  const phone = String(body.phone ?? "").trim();
  const consent = Boolean(body.consent);
  const source = String(body.source ?? "popup");
  const name = String(body.name ?? "").trim();
  const smsConsent = Boolean(body.smsConsent);

  // Validation: reject malformed email up front (was: only truthy check).
  if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });

  const outcome: Record<string, unknown> = { klaviyo: null, shopify: null, supabase: null };

  // Klaviyo — the reachability system. Klaviyo dedupes by email server-side.
  if (KLAVIYO_COMPANY_ID && KLAVIYO_LIST_ID) {
    outcome.klaviyo = await subscribeKlaviyo(email, phone, name, source, smsConsent);
  }
  // Shopify customer (only when a token is configured). Idempotent on email.
  if (ADMIN_TOKEN) {
    outcome.shopify = await createShopifyCustomer(email, phone, name, source);
  } else {
    outcome.shopify = { ok: false, skipped: "no_admin_token" };
  }
  // Our own lead copy — but only if we don't already have this email (dedupe).
  if (SUPABASE_URL && SUPABASE_KEY) {
    if (await leadExists(email)) {
      outcome.supabase = { ok: true, deduped: true };
    } else {
      outcome.supabase = await insertSupabase(email, phone, consent, source, name, smsConsent);
    }
  }

  if (debug) {
    return NextResponse.json({
      ok: true,
      hasSupabaseUrl: Boolean(SUPABASE_URL),
      hasSupabaseKey: Boolean(SUPABASE_KEY),
      hasAdminToken: Boolean(ADMIN_TOKEN),
      hasKlaviyo: Boolean(KLAVIYO_COMPANY_ID && KLAVIYO_LIST_ID),
      outcome,
    });
  }
  return NextResponse.json({ ok: true });
}
