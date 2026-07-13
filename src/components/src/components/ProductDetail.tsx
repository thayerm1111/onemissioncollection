"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ShopProduct } from "@/lib/shopify";
import { checkoutDomain } from "@/lib/shopify";
import { productPid } from "@/data/products";

const numeric = (id: string) => id.split("/").pop();
const cartUrl = (ids: string[]) =>
  `https://${checkoutDomain}/cart/${ids.map((i) => `${numeric(i)}:1`).join(",")}`;

type Parsed = ShopProduct["variants"][number] & { color: string | null; size: string | null };
function parse(v: ShopProduct["variants"][number]): Parsed {
  const parts = v.title.split(" / ");
  return { ...v, color: parts.length > 1 ? parts[0] : null, size: parts.length > 1 ? parts[1] : parts[0] };
}

export function ProductDetail({ product, pairs = [] }: { product: ShopProduct; pairs?: ShopProduct[] }) {
  const imgs = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const parsed = useMemo(() => product.variants.map(parse), [product]);
  const colors = useMemo(() => [...new Set(parsed.map((v) => v.color).filter(Boolean))] as string[], [parsed]);
  const sizes = useMemo(() => [...new Set(parsed.map((v) => v.size).filter(Boolean))] as string[], [parsed]);
  const single = product.variants.length <= 1;

  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [size, setSize] = useState<string | null>(null);

  const colorImgMap = product.colorImages ?? {};
  const hasColorImgs = Object.keys(colorImgMap).length > 0;
  const gallery = useMemo(() => {
    if (!hasColorImgs) return { list: imgs, colorOf: {} as Record<string, string> };
    const fronts = Object.values(colorImgMap);
    const list: string[] = [];
    const colorOf: Record<string, string> = {};
    const used = new Set<string>();
    for (const c of colors) {
      const front = colorImgMap[c];
      if (!front || used.has(front)) continue;
      list.push(front); used.add(front); colorOf[front] = c;
      const idx = imgs.indexOf(front);
      const back = idx >= 0 ? imgs[idx + 1] : undefined;
      if (back && !fronts.includes(back) && !used.has(back)) { list.push(back); used.add(back); colorOf[back] = c; }
    }
    for (const u of imgs) if (!used.has(u)) { list.push(u); used.add(u); }
    return { list, colorOf };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);
  const galleryImgs = gallery.list;
  const colorOf = gallery.colorOf;
  const [img, setImg] = useState<string | null>((color && colorImgMap[color]) || galleryImgs[0] || null);

  function pickColor(c: string) {
    setColor(c);
    if (colorImgMap[c]) setImg(colorImgMap[c]);
  }
  function pickImg(u: string) {
    setImg(u);
    const c = colorOf[u];
    if (c) setColor(c);
  }

  const selected = single
    ? product.variants[0]
    : parsed.find((v) => (colors.length ? v.color === color : true) && v.size === size) ?? null;
  const soldOut = Boolean(product.soldOut);

  function addToBag() {
    if (soldOut || !selected) return;
    window.location.href = cartUrl([selected.id]);
  }

  return (
    <div className="mx-auto max-w-site px-5 py-8 sm:px-8 sm:py-12">
      <Link href="/" className="label text-mute hover:text-ink">← Shop</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] w-full overflow-hidden bg-stone">
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={product.imageAlt ?? product.title} className="h-full w-full object-cover" />
            )}
          </div>
          {galleryImgs.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {galleryImgs.map((u, i) => (
                <button
                  key={i}
                  onClick={() => pickImg(u)}
                  aria-label={`Photo ${i + 1}`}
                  className={`h-16 w-16 overflow-hidden bg-stone ${img === u ? "ring-1 ring-ink" : "ring-1 ring-line"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:pt-2">
          <p className="label text-mute">One Mission</p>
          <h1 className="mt-2 text-xl font-medium text-ink sm:text-2xl">{product.title}</h1>
          <p className="mt-3 text-base text-ink">{product.hasOptions ? "From " : ""}{product.minPrice}</p>

          {product.badge && (
            <div className="mt-4 inline-flex items-center gap-2 border border-ink px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
              <span className="text-[11px] font-semibold uppercase tracking-widest2 text-ink">
                Limited availability — once it&apos;s gone, it&apos;s gone
              </span>
            </div>
          )}

          {!single && colors.length > 0 && (
            <div className="mt-8">
              <p className="label text-mute">Color: <span className="text-ink">{color}</span></p>
              <div className="mt-3 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => pickColor(c)}
                    className={`border px-3.5 py-2 text-xs uppercase tracking-wider2 transition-colors ${color === c ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!single && sizes.length > 0 && (
            <div className="mt-6">
              <p className="label text-mute">{product.optionName ?? "Size"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const exists = parsed.some((v) => v.size === s && (colors.length ? v.color === color : true) && v.availableForSale);
                  return (
                    <button
                      key={s}
                      disabled={!exists}
                      onClick={() => setSize(s)}
                      className={`min-w-[3rem] border px-3 py-2 text-xs uppercase tracking-wider2 transition-colors disabled:opacity-30 ${size === s ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={addToBag}
            disabled={soldOut || (!single && !selected)}
            className="mt-8 flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {soldOut ? "Sold out" : !single && !selected ? `Select a ${(product.optionName ?? "size").toLowerCase()}` : <>Add to bag <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="mt-3 text-center label-sm text-mute">Secure checkout via Shopify</p>

          {product.description && (
            <div className="mt-10 border-t border-line pt-6">
              <p className="label text-mute">Description</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {pairs.length > 0 && (
        <div className="mt-16 border-t border-line pt-10">
          <p className="label text-mute">Complete the set</p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-8">
            {pairs.map((p) => (
              <Link key={p.id} href={`/product/${productPid(p.id)}`} className="group block">
                <div className="aspect-[4/5] w-full overflow-hidden bg-stone">
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  )}
                </div>
                <p className="mt-3 text-sm text-ink">{p.title}</p>
                <p className="mt-1 text-sm text-mute">{p.minPrice}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
