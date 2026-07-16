import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Live per-variant stock for the drop, read via the Shopify Storefront API.
// Returns { ok, stock: { [numericVariantId]: quantityAvailable } }.
// If no Storefront token is configured yet, returns ok:false with empty stock
// and the UI falls back to the scarcity messaging without live numbers.
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "1-mission-2.myshopify.com";
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

const HANDLES = [
  "one-mission-statement-hoodie",
  "om-gold-hoodie",
  "om-x-one-mission",
  "heavy-weight-one-mission-grey-tee",
  "one-mission-heavyweight-tee-1",
  "one-mission-heavyweight-tee",
];

export async function GET() {
  if (!TOKEN) return NextResponse.json({ ok: false, stock: {} });

  const query = `query{ ${HANDLES.map(
    (h, i) =>
      `p${i}: productByHandle(handle:${JSON.stringify(h)}){ variants(first:60){ nodes{ id quantityAvailable } } }`,
  ).join(" ")} }`;

  try {
    const res = await fetch(`https://${DOMAIN}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });
    const json = await res.json();
    const stock: Record<string, number> = {};
    for (const key of Object.keys(json?.data ?? {})) {
      const nodes = json.data[key]?.variants?.nodes ?? [];
      for (const n of nodes) {
        const numeric = String(n.id).split("/").pop();
        if (numeric && typeof n.quantityAvailable === "number") {
          stock[numeric] = n.quantityAvailable;
        }
      }
    }
    return NextResponse.json({ ok: true, stock });
  } catch {
    return NextResponse.json({ ok: false, stock: {} });
  }
}
