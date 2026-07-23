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
  "founders-club-hoodie",
  "the-founders-club-sweatpants",
  "the-founders-club-lounge-shorts",
  "one-mission-tm-heavy-tee",
  "one-mission-workout-short",
  "snow-washed-frayed-hem-tank-top",
  "the-founders-crop-top",
  "one-mission-women-s-tight-crewneck-crop-tank-top",
  "womens-high-rise-yoga-shorts",
  "women-s-solid-high-rise-leggings",
];

export async function GET(req: Request) {
  const debug = new URL(req.url).searchParams.has("debug");
  if (!TOKEN) return NextResponse.json({ ok: false, stock: {}, reason: "no-token" });

  const query = `query{ ${HANDLES.map(
    (h, i) =>
      `p${i}: productByHandle(handle:${JSON.stringify(h)}){ handle variants(first:60){ nodes{ id quantityAvailable } } }`,
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
    if (debug) {
      return NextResponse.json({ ok: true, stock, _status: res.status, _errors: json?.errors ?? null, _raw: json?.data ?? null });
    }
    return NextResponse.json({ ok: true, stock });
  } catch (e) {
    return NextResponse.json({ ok: false, stock: {}, reason: debug ? String(e) : undefined });
  }
}
