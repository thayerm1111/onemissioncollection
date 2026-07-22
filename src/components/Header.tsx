"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { useCart } from "./cart/CartProvider";

/**
 * "Featured" is a collections dropdown. Each drop becomes a chapter here —
 * The Founders is the first. Add future drops to this list as they launch.
 */
const COLLECTIONS = [
  { label: "The Founders", href: "/featured", note: "Drop 01 · July 27" },
];

const NAV = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Accessories", href: "/accessories" },
  { label: "Mission", href: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const cart = useCart();

  // The drawer is portalled to <body>. It has to be: this header uses
  // backdrop-blur, and a backdrop-filter makes the header the containing block
  // for any fixed-position descendant — which collapsed the drawer to the
  // 64px header strip instead of filling the screen. Portalling escapes both
  // that containing block and the header's z-index stacking context.
  useEffect(() => setMounted(true), []);

  // Don't let the page scroll behind an open drawer.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // The header used to float transparently over a full-bleed mobile hero. The
  // Founders hero is its own dark section sitting below the header, so the
  // transparent mode left white-on-white nav on mobile. Header is always solid.
  const shell = "border-b border-line bg-paper/95 text-ink backdrop-blur";

  // Close the menus on navigation.
  useEffect(() => {
    setOpen(false);
    setShopOpen(false);
  }, [pathname]);

  return (
    <header className={`fixed left-0 right-0 top-0 z-40 border-b transition-colors duration-300 ${shell}`}>
      <div className="mx-auto grid h-16 max-w-site grid-cols-3 items-center px-5 sm:px-8">
        {/* Left: desktop nav / mobile menu button */}
        <div className="flex items-center gap-6">
          <button onClick={() => setOpen(true)} aria-label="Menu" className="sm:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            {/* Featured — collections dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                type="button"
                onClick={() => setShopOpen((v) => !v)}
                aria-expanded={shopOpen}
                aria-haspopup="true"
                className="label flex items-center gap-1 hover:opacity-60"
              >
                Featured
                <ChevronDown className={`h-3 w-3 transition-transform ${shopOpen ? "rotate-180" : ""}`} />
              </button>

              {shopOpen && (
                <div className="absolute left-0 top-full z-50 pt-3">
                  <div className="min-w-[248px] border border-line bg-paper py-2 shadow-lg">
                    {COLLECTIONS.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setShopOpen(false)}
                        className="block px-5 py-3 transition-colors hover:bg-stone"
                      >
                        <span className="block text-[13px] uppercase tracking-wider2 text-ink">
                          {c.label}
                        </span>
                        {c.note && (
                          <span className="mt-1 block text-[11px] tracking-wide text-mute">
                            {c.note}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="label hover:opacity-60">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: wordmark */}
        <Link href="/" className="justify-self-center text-center" aria-label="One Mission">
          <Wordmark />
        </Link>

        {/* Right: utilities */}
        <div className="flex items-center justify-end gap-4 sm:gap-5">
          <Link href="/account" aria-label="Account" className="hover:opacity-60">
            <User className="h-[18px] w-[18px]" />
          </Link>
          <button onClick={cart.open} aria-label="Bag" className="relative hover:opacity-60">
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cart.count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-[16px] place-items-center rounded-full bg-ink px-1 text-[10px] font-medium leading-none text-paper">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer — portalled to <body>, see the note by `mounted` above. */}
      {mounted && open && createPortal(
        <div
          className="sm:hidden"
          style={{ position: "fixed", inset: 0, zIndex: 9999 }}
        >
          <div
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(16,16,16,0.45)" }}
            onClick={() => setOpen(false)}
          />
          <div
            className="w-4/5 max-w-xs p-6 text-ink shadow-2xl"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              backgroundColor: "#ffffff",
              overflowY: "auto",
            }}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="label text-mute">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {/* Collections first */}
              <div>
                <span className="label text-mute">Featured</span>
                <div className="mt-3 flex flex-col gap-3 pl-3">
                  {COLLECTIONS.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="text-lg uppercase tracking-wider2 text-ink"
                    >
                      {c.label}
                      {c.note && (
                        <span className="mt-0.5 block text-[11px] normal-case tracking-wide text-mute">
                          {c.note}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="text-lg uppercase tracking-wider2 text-ink"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
