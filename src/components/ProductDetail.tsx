"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ShopProduct } from "@/lib/shopify";
import { checkoutDomain } from "@/lib/shopify";
import { productPid } from "@/data/products";

const numeric = (id: string) => id.split("/").pop();
const cartUrl = (ids: string[]) =>
  `https://${checkoutDomain}/cart/${ids.map((i) => `${numeric(i)}:1`).join(",")}`;
const priceNum = (v?: string) => Number((v ?? "").replace(/[^0-9.]/g, "")) || 0;
const money = (n: number) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));

// "← Shop" returns to the exact listing (and scroll spot) the shopper came
// from — Men / Women / a subcategory — instead of resetting to the All grid.
function BackToShop() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push("/");
      }}
      className="label text-mute hover:text-ink"
    >
      ← Shop
    </button>
  );
}

type Parsed = ShopProduct["variants"][number] & { color: string | null; size: string | null };
function parse(v: ShopProduct["variants"][number]): Parsed {
  const parts = v.title.split(" / ");
  return { ...v, color: parts.length > 1 ? parts[0] : null, size: parts.length > 1 ? parts[1] : parts[0] };
}

/* Fullscreen zoom lightbox — arrow keys page, click image toggles 2× zoom, Esc/outside closes. */
function Lightbox({
  images, index, alt, onIndex, onClose,
}: {
  images: string[]; index: number; alt: string; onIndex: (i: number) => void; onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const n = images.length;
  const go = (d: number) => { setZoomed(false); onIndex((index + d + n) % n); };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, n]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4" onClick={onClose}>
      <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 z-10 text-paper/80 hover:text-paper">
        <X className="h-6 w-6" />
      </button>
      {n > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous" className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/15 text-paper hover:bg-paper/25 sm:left-6"><ChevronLeft className="h-6 w-6" /></button>
          <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next" className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/15 text-paper hover:bg-paper/25 sm:right-6"><ChevronRight className="h-6 w-6" /></button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest2 text-paper/70">{index + 1} / {n}</span>
        </>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt={alt}
        onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
        className={`max-h-[92vh] max-w-full select-none object-contain transition-transform duration-300 ${zoomed ? "scale-[1.9] cursor-zoom-out" : "cursor-zoom-in"}`}
      />
    </div>
  );
}

/* Main image + thumbnails, with arrow-key paging, on-screen prev/next, and zoom. */
function Gallery({
  images, alt, index, onIndex,
}: {
  images: string[]; alt: string; index: number; onIndex: (i: number) => void;
}) {
  const [zoom, setZoom] = useState(false);
  const n = images.length;
  const go = (d: number) => onIndex((index + d + n) % n);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (zoom) return; // lightbox handles its own keys
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, n, zoom]);

  const cur = images[index] ?? null;
  return (
    <div>
      <div className="group relative aspect-[4/5] w-full overflow-hidden bg-stone">
        <button type="button" onClick={() => cur && setZoom(true)} className="block h-full w-full cursor-zoom-in" aria-label="Zoom image">
          {cur && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cur} alt={alt} className="h-full w-full object-cover" />
          )}
        </button>
        {n > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity group-hover:opacity-100"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity group-hover:opacity-100"><ChevronRight className="h-4 w-4" /></button>
          </>
        )}
        <span className="pointer-events-none absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity group-hover:opacity-100"><ZoomIn className="h-4 w-4" /></span>
      </div>
      {n > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((u, i) => (
            <button key={`${u}-${i}`} onClick={() => onIndex(i)} aria-label={`Photo ${i + 1}`}
              className={`h-16 w-16 overflow-hidden bg-stone ${index === i ? "ring-1 ring-ink" : "ring-1 ring-line"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {zoom && cur && <Lightbox images={images} index={index} alt={alt} onIndex={onIndex} onClose={() => setZoom(false)} />}
    </div>
  );
}

export function ProductDetail({ product, pairs = [], bundleItems = [] }: { product: ShopProduct; pairs?: ShopProduct[]; bundleItems?: ShopProduct[] }) {
  if (product.bundle?.length && bundleItems.length >= 2) {
    return <BundleDetail bundle={product} items={bundleItems} />;
  }
  return <SingleProductDetail product={product} pairs={pairs} />;
}

function SingleProductDetail({ product, pairs = [] }: { product: ShopProduct; pairs?: ShopProduct[] }) {
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

  const initialIdx = Math.max(0, galleryImgs.indexOf((color && colorImgMap[color]) || galleryImgs[0]));
  const [imgIndex, setImgIndex] = useState(initialIdx);

  function pickColor(c: string) {
    setColor(c);
    const front = colorImgMap[c];
    if (front) { const i = galleryImgs.indexOf(front); if (i >= 0) setImgIndex(i); }
  }
  function pickIndex(i: number) {
    setImgIndex(i);
    const c = colorOf[galleryImgs[i]];
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
      <BackToShop />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery images={galleryImgs} alt={product.imageAlt ?? product.title} index={Math.min(imgIndex, galleryImgs.length - 1)} onIndex={pickIndex} />

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

/* ---------------- Bundle ("The Fit") ---------------- */

function useConfigurator(product?: ShopProduct) {
  const variants = product?.variants ?? [];
  const parsed = useMemo(() => variants.map(parse), [product]);
  const colors = useMemo(() => [...new Set(parsed.map((v) => v.color).filter(Boolean))] as string[], [parsed]);
  const sizes = useMemo(() => [...new Set(parsed.map((v) => v.size).filter(Boolean))] as string[], [parsed]);
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [size, setSize] = useState<string | null>(null);
  const colorImages = product?.colorImages ?? {};
  const image = (color && colorImages[color]) || product?.imageUrl || product?.images?.[0] || null;
  const variant = parsed.find((v) => (colors.length ? v.color === color : true) && v.size === size) ?? null;
  return { product, parsed, colors, sizes, color, setColor, size, setSize, image, variant };
}
type Cfg = ReturnType<typeof useConfigurator>;

function shortName(p?: ShopProduct) {
  switch (p?.type) {
    case "Hoodies": return "Hoodie";
    case "Shorts": return "Shorts";
    case "T-Shirts": return "Tee";
    case "Sweatshirts": return "Sweatshirt";
    default: return p?.title ?? "Item";
  }
}

function Config({ cfg }: { cfg: Cfg }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-ink">{shortName(cfg.product)} · <span className="text-mute">{cfg.product?.title}</span></p>
        <p className="label text-mute">{cfg.product?.minPrice}</p>
      </div>
      {cfg.colors.length > 0 && (
        <div className="mt-3">
          <p className="label-sm text-mute">Color: <span className="text-ink">{cfg.color}</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cfg.colors.map((c) => (
              <button key={c} onClick={() => cfg.setColor(c)}
                className={`border px-3 py-1.5 text-[11px] uppercase tracking-wider2 transition-colors ${cfg.color === c ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"}`}>{c}</button>
            ))}
          </div>
        </div>
      )}
      {cfg.sizes.length > 0 && (
        <div className="mt-3">
          <p className="label-sm text-mute">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cfg.sizes.map((sz) => {
              const exists = cfg.parsed.some((v) => v.size === sz && (cfg.colors.length ? v.color === cfg.color : true) && v.availableForSale);
              return (
                <button key={sz} disabled={!exists} onClick={() => cfg.setSize(sz)}
                  className={`min-w-[2.75rem] border px-2.5 py-1.5 text-[11px] uppercase tracking-wider2 transition-colors disabled:opacity-30 ${cfg.size === sz ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"}`}>{sz}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function BundleDetail({ bundle, items }: { bundle: ShopProduct; items: ShopProduct[] }) {
  // Hooks must be called unconditionally — support up to 4 pieces in a set.
  const c0 = useConfigurator(items[0]);
  const c1 = useConfigurator(items[1]);
  const c2 = useConfigurator(items[2]);
  const c3 = useConfigurator(items[3]);
  const cfgs = [c0, c1, c2, c3].filter((c) => c.product);

  const heroList = bundle.images?.length ? bundle.images : bundle.imageUrl ? [bundle.imageUrl] : [];
  const thumbs = [...heroList, ...cfgs.map((c) => c.image).filter(Boolean)] as string[];
  const [heroIndex, setHeroIndex] = useState(0);
  const idx = Math.min(heroIndex, thumbs.length - 1);

  const total = cfgs.reduce((sum, c) => sum + priceNum(c.product?.minPrice), 0);
  const allReady = cfgs.every((c) => c.variant);
  const buy = (ids: (string | undefined)[]) => {
    const v = ids.filter(Boolean) as string[];
    if (v.length) window.location.href = cartUrl(v);
  };

  return (
    <div className="mx-auto max-w-site px-5 py-8 sm:px-8 sm:py-12">
      <BackToShop />
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery images={thumbs} alt={bundle.title} index={idx} onIndex={setHeroIndex} />

        {/* Details */}
        <div className="lg:pt-2">
          <p className="label text-mute">One Mission · The Set</p>
          <h1 className="mt-2 text-xl font-medium text-ink sm:text-2xl">{bundle.title}</h1>
          <p className="mt-3 text-base text-ink">Set {money(total)} <span className="text-mute">· or buy any piece</span></p>

          <div className="mt-8 space-y-7">
            {cfgs.map((c, i) => {
              // Picking a piece's color jumps the main image to that piece so the
              // shopper immediately sees the color they selected.
              const bound: Cfg = { ...c, setColor: (v) => { c.setColor(v); setHeroIndex(heroList.length + i); } };
              return (
                <div key={c.product?.id ?? i}>
                  {i > 0 && <div className="mb-7 border-t border-line" />}
                  <Config cfg={bound} />
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-2.5">
            <button onClick={() => buy(cfgs.map((c) => c.variant?.id))} disabled={!allReady}
              className="flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition-opacity hover:opacity-90 disabled:opacity-40">
              {allReady ? <>Add the set — {money(total)} <ArrowRight className="h-4 w-4" /></> : "Select a size for each piece"}
            </button>
            <div className="grid grid-cols-3 gap-2.5">
              {cfgs.map((c, i) => (
                <button key={c.product?.id ?? i} onClick={() => buy([c.variant?.id])} disabled={!c.variant}
                  className="border border-ink px-2 py-3 text-[11px] uppercase tracking-widest2 text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-30">
                  {shortName(c.product)} · {c.product?.minPrice}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center label-sm text-mute">Secure checkout via Shopify</p>

          {bundle.description && (
            <div className="mt-10 border-t border-line pt-6">
              <p className="label text-mute">The look</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{bundle.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
