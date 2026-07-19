/**
 * THE FOUNDERS COLLECTION — first drop.
 *
 * Five pieces, 500 units each (2,500 total), capped in Shopify so they can
 * genuinely sell out. Images are pulled live from the Shopify CDN — the hoodie
 * and lounge shorts lead with the model shots.
 *
 * PRE_LAUNCH (see products.ts) keeps the store in "coming soon" mode: the
 * pieces are visible, but nothing can be added to cart until launch day.
 */
import type { ShopProduct } from "@/lib/shopify";

const CDN = "https://cdn.shopify.com/s/files/1/1016/0406/5559/files";
const img = (file: string, v: string) => `${CDN}/${file}.png?v=${v}`;
const V = (id: string, title: string, price: string) => ({
  id: `gid://shopify/ProductVariant/${id}`,
  title, availableForSale: true, price, currency: "USD",
});

/* ---------- image sets (model shots first) ---------- */
const HOODIE_IMGS = [
  img("08ee07ff5cc34c9db2bdbfa390a4ee15", "1784493957"),
  img("06bb8cdd94134847a9d0e8aba691bf21", "1784493958"),
  img("d96d43e4b48c47fd9950f6d51843228c", "1784493957"),
  img("8e125bae4e674ee98f69965d3b58a67f", "1784493957"),
  img("2ce80c15271c4c9e8bd0c569db9483db", "1784493957"),
  img("11b70f0ce2fb4ab9bc2b977a2079e35a", "1784493957"),
];
const SWEATPANT_IMGS = [
  img("d1f54a0738334855ae546a1ef42ca7ad", "1784494432"),
  img("a5e83aa8c93d486383f4e63fba039fd4", "1784494431"),
  img("ea99d2945a7340abbb2b2c69b537f345", "1784494430"),
];
const SHORTS_IMGS = [
  img("27b5146931d345d79e995588ec7feb4c", "1784493712"),
  img("becf7e2da6e64a7b96d4e6f9e9aab9fc", "1784493712"),
  img("0e31268cba0d49728abe2b1f4f713471", "1784493712"),
  img("de50186913cf4fcb9243c887611542f8", "1784493711"),
  img("471fcd8eda6b49fabb55e82a2c945d8b", "1784493711"),
];
const TEE_IMGS = [
  img("89de5daff21c427e846acd19550cf818", "1784495766"),
  img("cbf578799000443a8324b6bcfdb10a32", "1784495767"),
  img("a83a4117a1ba47c19e5b14ca8d14b106", "1784495767"),
  img("f9c02bd0970a43ef9224cab2ce98a22e", "1784495767"),
];
const YOGA_IMGS = [
  img("99bd8a39eb79489882f2605d6dd8e548", "1784495886"),
  img("46629454b6d04a53ba01b912dc64119c", "1784495886"),
  img("64fdb499742740d0904200c63e7b745f", "1784495886"),
  img("b994fe914c33427e9e1c06ea7d1da38f", "1784495886"),
  img("cb1b6501855e46d7a1b14c0292a58ae7", "1784495886"),
  img("1bf766bec1054621993f4ea3af9389f7", "1784495886"),
  img("d69b5ec7305848d88ce72d43bbf45115", "1784495886"),
  img("724aa83cdeba4b9f9afc7b9d6880147c", "1784495885"),
];

const SIZES = ["S", "M", "L", "XL", "2XL"];

/** Ordered ids — drives the collection layout. */
export const FOUNDERS_HOODIE = "gid://shopify/Product/10426914013463";
export const FOUNDERS_SWEATPANTS = "gid://shopify/Product/10426916471063";
export const FOUNDERS_SHORTS = "gid://shopify/Product/10426914996503";
export const FOUNDERS_TEE = "gid://shopify/Product/10410648699159";
export const FOUNDERS_YOGA = "gid://shopify/Product/10419151339799";

export const FOUNDERS_MENS_IDS = [
  FOUNDERS_HOODIE, FOUNDERS_SWEATPANTS, FOUNDERS_SHORTS, FOUNDERS_TEE,
];
export const FOUNDERS_WOMENS_IDS = [FOUNDERS_YOGA];
export const FOUNDERS_ALL_IDS = [...FOUNDERS_MENS_IDS, ...FOUNDERS_WOMENS_IDS];

/* ---------- new products (not previously in the catalog) ---------- */
export const FOUNDERS_NEW: ShopProduct[] = [
  {
    id: FOUNDERS_HOODIE,
    title: "Founders Club Hoodie",
    handle: "founders-club-hoodie",
    description:
      "Vintage washed, frayed heavyweight fleece. 10.6 oz — the anchor piece of the Founders Collection. Limited to 500.",
    imageUrl: HOODIE_IMGS[0], imageAlt: "Founders Club Hoodie",
    images: HOODIE_IMGS,
    minPrice: "$99.99", currency: "USD", hasOptions: true,
    badge: "Founders Collection",
    variants: SIZES.map((s, i) =>
      V(["54121865806103","54121865838871","54121865871639","54121865904407","54121865937175"][i], `Black / ${s}`, "$99.99"),
    ),
  },
  {
    id: FOUNDERS_SWEATPANTS,
    title: "Founders Club Sweatpants",
    handle: "the-founders-club-sweatpants",
    description:
      "Straight-leg heavyweight sweatpant, 12.7 oz brushed cotton blend. Built to be lived in. Limited to 500.",
    imageUrl: SWEATPANT_IMGS[0], imageAlt: "Founders Club Sweatpants",
    images: SWEATPANT_IMGS,
    minPrice: "$79.99", currency: "USD", hasOptions: true,
    badge: "Founders Collection",
    variants: SIZES.map((s, i) =>
      V(["54121874882839","54121874915607","54121874948375","54121874981143","54121875013911"][i], `Black / ${s}`, "$79.99"),
    ),
  },
  {
    id: FOUNDERS_SHORTS,
    title: "Founders Club Lounge Shorts",
    handle: "the-founders-club-lounge-shorts",
    description:
      "Sun-faded, distressed 100% cotton short. Broken-in from day one. Limited to 500.",
    imageUrl: SHORTS_IMGS[0], imageAlt: "Founders Club Lounge Shorts",
    images: SHORTS_IMGS,
    minPrice: "$59.99", currency: "USD", hasOptions: true,
    badge: "Founders Collection",
    variants: SIZES.map((s, i) =>
      V(["54121870033175","54121870065943","54121870098711","54121870131479","54121870164247"][i], `Black / ${s}`, "$59.99"),
    ),
  },
];

/* ---------- existing catalog products, re-skinned for the drop ---------- */
export const FOUNDERS_OVERRIDES: Array<Partial<ShopProduct> & { id: string }> = [
  {
    id: FOUNDERS_TEE,
    title: "Founders Club Tee",
    description:
      "Essential heavyweight cotton tee, 9.7 oz, drop shoulder. Four colorways. Limited to 500.",
    imageUrl: TEE_IMGS[0], imageAlt: "Founders Club Tee",
    images: TEE_IMGS,
    minPrice: "$49.99",
    badge: "Founders Collection",
  },
  {
    id: FOUNDERS_YOGA,
    title: "Founders Club Yoga Shorts",
    description:
      "High-rise, second-skin nylon/spandex short. Four colorways. Limited to 500.",
    imageUrl: YOGA_IMGS[0], imageAlt: "Founders Club Yoga Shorts",
    images: YOGA_IMGS,
    minPrice: "$39.99",
    badge: "Founders Collection",
  },
];
