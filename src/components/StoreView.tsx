import Link from "next/link";
import type { ShopProduct } from "@/lib/shopify";
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
  return (
    <div className="mx-auto max-w-site px-5 py-6 sm:px-8">
      {/* Sub-bar */}
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
        <span className="label text-mute">{products.length} Items</span>
      </div>

      <div className="pt-8 sm:pt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
