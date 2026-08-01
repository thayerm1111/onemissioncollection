"use client";

import { useEffect } from "react";

/**
 * Registers the service worker so the site is installable as an app and works
 * offline-ish. Runs after load, fails silently on unsupported browsers.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
