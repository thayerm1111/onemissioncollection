"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { checkoutDomain } from "@/lib/shopify";
import { Wordmark } from "./Wordmark";

const NAV = [
  { label: "Featured", href: "/featured" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Accessories", href: "/accessories" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const bagHref = `https://${checkoutDomain}/cart`;

  // On mobile the home hero is a full-bleed image, so the header floats
  // transparently over it and turns solid on scroll. On desktop the hero is a
  // light image/text split, so the header stays solid there.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.82);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const mq = window.matchMedia("(max-width: 899px)");
    const onMq = () => setMobile(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMq);
    };
  }, [pathname]);

  const overlay = pathname === "/" && !scrolled && mobile;
  const shell = overlay
    ? "border-transparent bg-transparent text-white"
    : "border-b border-line bg-paper/95 text-ink backdrop-blur";

  return (
    <header className={`fixed left-0 right-0 top-0 z-40 border-b transition-colors duration-300 ${shell}`}>
      <div className="mx-auto grid h-16 max-w-site grid-cols-3 items-center px-5 sm:px-8">
        {/* Left: desktop nav / mobile menu button */}
        <div className="flex items-center gap-6">
          <button onClick={() => setOpen(true)} aria-label="Menu" className="sm:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
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
          <button aria-label="Search" className="hidden hover:opacity-60 sm:block">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <a href={bagHref} aria-label="Account" className="hover:opacity-60">
            <User className="h-[18px] w-[18px]" />
          </a>
          <a href={bagHref} aria-label="Bag" className="hover:opacity-60">
            <ShoppingBag className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-paper p-6 text-ink">
            <div className="mb-8 flex items-center justify-between">
              <span className="label text-mute">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
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
        </div>
      )}
    </header>
  );
}
