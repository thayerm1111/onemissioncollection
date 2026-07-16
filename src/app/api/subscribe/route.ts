import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Storefront domain used for the native newsletter signup.
const SHOP = "https://1-mission-2.myshopify.com";

// Captures a marketing opt-in (email + phone) from the promo popup and creates
// the shopper as a Shopify customer with email-marketing consent — using the
// storefront's native newsletter form (no API token required). New sign-ups
// flow straight into the email list and the "VIP" customer tools.
//
// Persistence is best-effort: if the storefront POST fails for any reason we
// still return the code so the shopper's experience is never blocked.
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!email) {
    return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  }

  try {
    const form = new URLSearchParams();
    form.set("form_type", "customer");
    form.set("utf8", "✓");
    form.set("contact[email]", email);
    const tags = ["popup-25", "newsletter"];
    if (phone) tags.push(`phone:${phone}`);
    form.set("contact[tags]", tags.join(","));

    await fetch(`${SHOP}/contact#contact_form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; OMC-Signup/1.0)",
      },
      body: form.toString(),
      redirect: "manual",
    });
  } catch {
    // Never block the shopper from receiving their code.
  }

  return NextResponse.json({ ok: true, code: "WELCOME25" });
}
