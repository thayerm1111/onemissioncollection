import type { MetadataRoute } from "next";

// Serves /robots.txt automatically (Next.js App Router convention).
// Allows crawling of the public storefront; keeps admin/api/account out of the index.
const SITE = "https://onemissioncollection.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/account", "/reset-password"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
