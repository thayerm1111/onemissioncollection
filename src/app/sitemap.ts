import type { MetadataRoute } from "next";

// Serves /sitemap.xml automatically (Next.js App Router convention).
// Static marketing/legal routes + the 10 Founders product pages.
const SITE = "https://onemissioncollection.com";

// Numeric Shopify product IDs for the Founders drop (route: /product/[pid]).
const FOUNDERS_PIDS = [
  "10426914013463", "10426916471063", "10426914996503", "10410648699159",
  "10419151339799", "10426956841239", "10410155868439", "10410362568983",
  "10410180837655", "10419153633559",
];

// Public, indexable static routes.
const STATIC_ROUTES = [
  "", "founders", "featured", "men", "women", "accessories",
  "about", "affiliate", "inner-circle",
  "faq", "order-tracking",
  "returns", "terms", "privacy", "cookies", "accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: path ? `${SITE}/${path}` : SITE,
    lastModified: now,
    changeFrequency: path === "" || path === "founders" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "founders" ? 0.9 : 0.6,
  }));
  const productEntries: MetadataRoute.Sitemap = FOUNDERS_PIDS.map((pid) => ({
    url: `${SITE}/product/${pid}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));
  return [...staticEntries, ...productEntries];
}
