"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { checkoutDomain } from "@/lib/shopify";

const NAV = [
  { label: "Featured", href: "/" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const bagHref = `https://${checkoutDomain}/cart`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto grid max-w-site grid-cols-3 items-center px-5 py-4 sm:px-8">
        {/* Left: desktop nav / mobile menu button */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Menu"
            className="sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="label text-ink hover:opacity-60">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: wordmark */}
        <Link href="/" className="justify-self-center text-center">
          <span className="label-sm block leading-none text-mute">One Mission</span>
          <span className="block text-sm font-semibold uppercase tracking-widest2 text-ink sm:text-base">
            Collection
          </span>
        </Link>

        {/* Right: utilities */}
        <div className="flex items-center justify-end gap-4 text-ink sm:gap-5">
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
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-paper p-6">
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
