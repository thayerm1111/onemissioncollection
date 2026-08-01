import type { MetadataRoute } from "next";

// Web App Manifest — makes onemissioncollection.com installable as an app
// ("Add to Home Screen" on iOS, install prompt on Android). Served at
// /manifest.webmanifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "One Mission Collection",
    short_name: "One Mission",
    description:
      "Faith-driven streetwear for the ones who felt lost. Leaving the 99 to find the 1.",
    id: "/",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f2ec",
    theme_color: "#f5f2ec",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/app/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
