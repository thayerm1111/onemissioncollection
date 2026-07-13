import Link from "next/link";
import type { ShopProduct } from "@/lib/shopify";
import { productPid } from "@/data/products";

export function ProductGrid({ products }: { products: ShopProduct[] }) {
  if (products.length === 0) {
    return <p className="px-5 py-24 text-center label text-mute">Nothing here yet.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
      {products.map((p) => (
        <Tile key={p.id} product={p} />
      ))}
    </div>
  );
}

function Tile({ product }: { product: ShopProduct }) {
  const imgs = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const front = imgs[0] ?? null;
  const hover = imgs[1] ?? null;
  const soldOut = Boolean(product.soldOut);
  const href = `/product/${productPid(product.id)}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone">
        {front && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={front}
            alt={product.imageAlt ?? product.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hover ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {hover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hover}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {soldOut && (
          <span className="absolute left-4 top-4 label-sm text-ink">Sold out</span>
        )}
        {!soldOut && product.badge && (
          <span className="absolute left-4 top-4 label-sm text-ink">Featured</span>
        )}
        {!soldOut && product.badge && (
          <span className="absolute right-4 top-4 bg-ink px-2 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-paper">
            Limited
          </span>
        )}
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="label-sm text-mute">One Mission</p>
        <p className="mt-1 text-sm text-ink sm:text-[15px]">{product.title}</p>
        <p className="mt-1 text-sm text-mute">
          {product.hasOptions ? "" : ""}{product.minPrice}
        </p>
      </div>
    </Link>
  );
}
