import Link from "next/link";
import type { ShopProduct } from "@/lib/shopify";
import { productPid } from "@/data/products";

// Soft, warm paper tones — each product sits on its own tile shade, like the
// Essentials grid. Product flats are shot on a white sweep, so we blend them
// onto the tone (multiply) to pick up the color while the garment stays true.
const TILE_BGS = [
  "#f0ebe3", // warm sand
  "#eceae4", // greige
  "#f1ece2", // cream
  "#eae8e2", // oat
  "#efece7", // linen
  "#e9e7e1", // stone
];

// Stable per-product tone so a product keeps the same background across views.
function tileBg(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return TILE_BGS[h % TILE_BGS.length];
}

export function ProductGrid({ products, context }: { products: ShopProduct[]; context?: "women" }) {
  if (products.length === 0) {
    return <p className="px-5 py-24 text-center label text-mute">Nothing here yet.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
      {products.map((p) => (
        <Tile key={p.id} product={p} context={context} />
      ))}
    </div>
  );
}

// "$125" → "$ 125" to match the tracked-out label style.
function priceLabel(v?: string) {
  return (v ?? "").replace(/^\$\s*/, "$ ");
}

function Tile({ product, context }: { product: ShopProduct; context?: "women" }) {
  const imgs = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  // A `womenModel` shows only in the Women feed; otherwise fall back to the
  // shared model, then the flat product photo.
  const lead = (context === "women" && product.womenModel) || product.model || null;
  const front = lead ?? imgs[0] ?? null;
  const hover = lead ? (imgs[0] ?? null) : (imgs[1] ?? null);
  const soldOut = Boolean(product.soldOut);
  const href = `/product/${productPid(product.id)}`;

  // Lifestyle/model photos already have their own studio backdrop — leave them
  // true. Flat product shots sit on a white sweep, so blend them onto the tile
  // tone for the Essentials colored-tile look.
  const isModel = Boolean(lead);
  const blend = isModel ? undefined : ("multiply" as const);
  const bg = isModel ? "#efede9" : tileBg(product.id);

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ backgroundColor: bg }}>
        {front && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={front}
            alt={product.imageAlt ?? product.title}
            style={{ mixBlendMode: blend }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hover ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {hover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hover}
            alt=""
            aria-hidden="true"
            style={{ mixBlendMode: blend }}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 label-sm text-ink">Sold out</span>
        )}
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-mute">One Mission</p>
        <p className="mt-1.5 text-[13px] tracking-[0.02em] text-ink">{product.title}</p>
        <p className="mt-1 text-[13px] tracking-[0.06em] text-mute">{priceLabel(product.minPrice)}</p>
      </div>
    </Link>
  );
}
