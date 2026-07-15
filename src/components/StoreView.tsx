"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ShopProduct } from "@/lib/shopify";
import { TYPE_ORDER } from "@/data/products";
import { ProductGrid } from "./ProductGrid";

const TABS = [
  { label: "All", href: "/" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Accessories", href: "/accessories" },
];

export function StoreView({
  products,
  active,
}: {
  products: ShopProduct[];
  active: string;
}) {
  const [type, setType] = useState("All");

  // Subcategories present in this view, in preferred order.
  const types = useMemo(() => {
    const present = new Set(products.map((p) => p.type ?? "Other"));
    return TYPE_ORDER.filter((t) => present.has(t));
  }, [products]);

  const shown = type === "All" ? products : products.filter((p) => (p.type ?? "Other") === type);

  return (
    <div className="mx-auto max-w-site px-5 py-6 sm:px-8">
      {/* Top: gender tabs */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-5">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`label ${active === t.href ? "text-ink underline underline-offset-4" : "text-mute hover:text-ink"}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <span className="label text-mute">{shown.length} Items</span>
      </div>

      {/* Drill-down: subcategory chips */}
      {types.length > 1 && (
        <div className="-mx-5 mt-4 flex items-center gap-x-5 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <Chip label="All" count={products.length} active={type === "All"} onClick={() => setType("All")} />
          {types.map((t) => (
            <Chip
              key={t}
              label={t}
              count={products.filter((p) => (p.type ?? "Other") === t).length}
              active={type === t}
              onClick={() => setType(t)}
            />
          ))}
        </div>
      )}

      <div className="pt-8 sm:pt-10">
        <ProductGrid products={shown} />
      </div>
    </div>
  );
}

function Chip({
  label, count, active, onClick,
}: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 whitespace-nowrap py-1 text-[11px] uppercase tracking-[0.18em] transition-colors ${
        active ? "text-ink underline underline-offset-[6px]" : "text-mute hover:text-ink"
      }`}
    >
      {label} <span className="align-super text-[9px]">{count}</span>
    </button>
  );
}
