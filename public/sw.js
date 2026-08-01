/* One Mission Collection — service worker.
   Network-first so the live store is always fresh online; a small cache gives a
   graceful offline fallback and satisfies the installability requirement.
   Deliberately conservative: only same-origin GETs are touched — checkout
   (Shopify), CDN images, and analytics/pixels are never intercepted. */
const CACHE = "omc-v1";
const PRECACHE = ["/", "/manifest.webmanifest", "/app/icon-192.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never touch POST/checkout/api writes
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // leave Shopify/CDN/pixels alone

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Keep a fresh copy for offline fallback (only successful basic responses).
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match("/"))
      )
  );
});
