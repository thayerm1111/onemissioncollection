/**
 * THE FOUNDERS COLLECTION — first drop.
 *
 * Six pieces, 500 units each (3,000 total), capped in Shopify so they can
 * genuinely sell out. Images are pulled live from the Shopify CDN — the hoodie
 * and lounge shorts lead with the model shots.
 *
 * PRE_LAUNCH (see products.ts) keeps the store in "coming soon" mode: the
 * pieces are visible, but nothing can be added to cart until launch day.
 */
import type { ShopProduct } from "@/lib/shopify";

// build marker: crop-top-swap

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
  // Female model wearing the set (hosted in /public).
  "/founders/woman-front.jpg",
  "/founders/woman-back.jpg",
  "/founders/woman-seated.jpg",
];
// Sweatpants — reshot set hosted in /public (the earlier Shopify CDN set had a
// broken photo). Order: full front, back, leg detail, seated.
const SWEATPANT_IMGS = [
  "/founders/sweatpants-1.jpg",
  "/founders/sweatpants-2.jpg",
  "/founders/sweatpants-3.jpg",
  "/founders/sweatpants-4.jpg",
  // Female model wearing the set.
  "/founders/woman-front.jpg",
  "/founders/woman-back.jpg",
  "/founders/woman-pants.jpg",
  "/founders/woman-seated.jpg",
];
const SHORTS_IMGS = [
  img("27b5146931d345d79e995588ec7feb4c", "1784493712"),
  img("becf7e2da6e64a7b96d4e6f9e9aab9fc", "1784493712"),
  img("0e31268cba0d49728abe2b1f4f713471", "1784493712"),
  img("de50186913cf4fcb9243c887611542f8", "1784493711"),
  img("471fcd8eda6b49fabb55e82a2c945d8b", "1784493711"),
];
// Tee / yoga / crop were re-cut to Black-only in Tapstitch with new pricing —
// these image sets and variants match that final state.
const TEE_IMGS = [
  img("89de5daff21c427e846acd19550cf818", "1784498690"),
  img("cbf578799000443a8324b6bcfdb10a32", "1784498690"),
  img("a83a4117a1ba47c19e5b14ca8d14b106", "1784498690"),
  img("f9c02bd0970a43ef9224cab2ce98a22e", "1784498690"),
];
const YOGA_IMGS = [
  img("99bd8a39eb79489882f2605d6dd8e548", "1784499322"),
  img("46629454b6d04a53ba01b912dc64119c", "1784499321"),
];

const CROP_IMGS = [
  img("840c6d9fcd7a4b438332a4da72039d55", "1784509146"),
  img("219d1989ccf740bc883908474ae9ada5", "1784509146"),
  img("64a93ed56bc048eb8252359bc0399490", "1784509145"),
  img("18196a0d46c9465fac1e6e956e774a4f", "1784509145"),
];

// Second wave — added July 21. Athletic shorts + washed tank (they share the
// same model shoot) and a women's sport crop.
const ATHSHORTS_IMGS = [
  img("e941cdfb49034938b7a22f65a1d1f1d2", "1784664487"),
  img("14b8235998a3428caea1f1e71a9f4ed0", "1784664487"),
  img("ea493f51207e4101a6105ec328e945b9", "1784664487"),
  img("5e506ddf24d94a41a06cda6f8fbd0ed2", "1784664486"),
  img("ae96ca0d46b64a218e8922d601003d68", "1784664485"),
];
// Grouped by colorway so the PDP color swap works: Black block first (it's the
// default), then Light Gray. Each block leads with its "front" shot — the
// gallery pairs a color's front image with the one immediately after it.
const TANK_BLACK = img("5bda111e3737437ab238d8d9c2bf7744", "1784664517");     // model, front
const TANK_GRAY = img("60165aae6b144d23b71db43d4865e0ff", "1784664517");      // model, front
const TANK_IMGS = [
  TANK_BLACK,                                                // black — model front
  img("8e87b3b7888a4752b6b9767d7b818351", "1784664516"),     // black — model back
  img("104ce92f580f4ac4b3e6ac7b3e05dc63", "1784664516"),     // black — flat front
  img("99f71fa5bdbf4c34a33107d26b2405f4", "1784664516"),     // black — flat back
  TANK_GRAY,                                                 // gray — model front
  img("ceefd87ec02e48ea8b7a2e4073e5ff47", "1784664517"),     // gray — flat front
  img("1d73c57422534c4087136bc530473ed6", "1784664516"),     // gray — flat back
];
const SPORTCROP_IMGS = [
  img("caca9e8394504865a1217595fa4da476", "1784659357"),
  img("54452895606d4f268ef58d57dd8b36ba", "1784659356"),
];
const LEGGINGS_IMGS = [
  img("4f6b1f07635842699bb09c38b6389c72", "1784666527"),
  img("15d9e842daee4c02997c00e050bb80f8", "1784666527"),
  img("ab7af5f440bb40289e0a416ad9c51f63", "1784666527"),
  img("66573ae81ddd4b6d98170e572c32568b", "1784666526"),
  img("69e6ddf8890e4d8ea5b6e2f8508c9b5f", "1784666527"),
  img("6b62147832e247f9b6704aa9deba4911", "1784666526"),
];

const SIZES = ["S", "M", "L", "XL", "2XL"];

/** Ordered ids — drives the collection layout. */
export const FOUNDERS_HOODIE = "gid://shopify/Product/10426914013463";
export const FOUNDERS_SWEATPANTS = "gid://shopify/Product/10426916471063";
export const FOUNDERS_SHORTS = "gid://shopify/Product/10426914996503";
export const FOUNDERS_TEE = "gid://shopify/Product/10410648699159";
export const FOUNDERS_YOGA = "gid://shopify/Product/10419151339799";
export const FOUNDERS_CROP = "gid://shopify/Product/10426956841239";
export const FOUNDERS_ATHSHORTS = "gid://shopify/Product/10410155868439";
export const FOUNDERS_TANK = "gid://shopify/Product/10410362568983";
export const FOUNDERS_SPORTCROP = "gid://shopify/Product/10410180837655";
export const FOUNDERS_LEGGINGS = "gid://shopify/Product/10419153633559";

export const FOUNDERS_MENS_IDS = [
  FOUNDERS_HOODIE, FOUNDERS_SWEATPANTS, FOUNDERS_SHORTS, FOUNDERS_TEE,
  FOUNDERS_ATHSHORTS, FOUNDERS_TANK,
];
// Women's cuts of the unisex set — same garments and Shopify variants, shown on
// a female model only. Synthetic "-w" ids keep the product routes unique while
// still checking out against the real variants (see FOUNDERS_NEW).
export const FOUNDERS_HOODIE_W = "gid://shopify/Product/10426914013463-w";
export const FOUNDERS_SWEATPANTS_W = "gid://shopify/Product/10426916471063-w";

export const FOUNDERS_WOMENS_IDS = [
  FOUNDERS_HOODIE_W, FOUNDERS_SWEATPANTS_W,
  FOUNDERS_CROP, FOUNDERS_SPORTCROP, FOUNDERS_YOGA, FOUNDERS_LEGGINGS,
];
export const FOUNDERS_ALL_IDS = [...FOUNDERS_MENS_IDS, ...FOUNDERS_WOMENS_IDS];

/* ---------- new products (not previously in the catalog) ---------- */
export const FOUNDERS_NEW: ShopProduct[] = [
  {
    id: FOUNDERS_HOODIE,
    title: "Founders Club Hoodie",
    handle: "founders-club-hoodie",
    description:
      "Vintage washed, frayed heavyweight fleece. 10.6 oz — the anchor piece of the Founders Collection. Limited supply.",
    imageUrl: HOODIE_IMGS[0], imageAlt: "Founders Club Hoodie",
    images: HOODIE_IMGS,
    // Flagged as a model lead so the grid skips the multiply blend — the
    // appended female shots are on a dark backdrop and would crush to black.
    model: HOODIE_IMGS[0],
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
      "Straight-leg heavyweight sweatpant, 12.7 oz brushed cotton blend. Built to be lived in. Limited supply.",
    imageUrl: SWEATPANT_IMGS[0], imageAlt: "Founders Club Sweatpants",
    images: SWEATPANT_IMGS,
    // Shot on a dark studio backdrop, so flag as a model lead — that skips the
    // multiply blend the grid applies to white-sweep flats (which would crush
    // these to black). `flat` = the cropped leg-detail for the "Style With" tile.
    model: SWEATPANT_IMGS[0],
    flat: SWEATPANT_IMGS[2],
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
      "Sun-faded, distressed 100% cotton short. Broken-in from day one. Limited supply.",
    imageUrl: SHORTS_IMGS[0], imageAlt: "Founders Club Lounge Shorts",
    images: SHORTS_IMGS,
    minPrice: "$59.99", currency: "USD", hasOptions: true,
    badge: "Founders Collection",
    variants: SIZES.map((s, i) =>
      V(["54121870033175","54121870065943","54121870098711","54121870131479","54121870164247"][i], `Black / ${s}`, "$59.99"),
    ),
  },
  {
    // Re-cut in Tapstitch as a brand-new product (the previous crop tee was
    // glitching its mockups and has been archived in Shopify).
    id: FOUNDERS_CROP,
    title: "Founders Club Crop Top",
    handle: "the-founders-crop-top",
    description:
      "Snow-washed cropped tee, boxy fit. Black. S–XL. Limited supply.",
    imageUrl: CROP_IMGS[0], imageAlt: "Founders Club Crop Top",
    images: CROP_IMGS,
    minPrice: "$49.99", currency: "USD", hasOptions: true,
    badge: "Founders Collection",
    variants: [
      ["54122016375063", "Black / S"], ["54122016407831", "Black / M"],
      ["54122016440599", "Black / L"], ["54122016473367", "Black / XL"],
    ].map(([id, title]) => V(id, title, "$49.99")),
  },

  // ---- Women's listings of the unisex hoodie + sweatpants (girl-only photos) ----
  // Same garments and variant ids as the men's entries, so they check out
  // against the same Shopify inventory — just merchandised on the female model
  // for the Women feed.
  {
    id: FOUNDERS_HOODIE_W,
    title: "Founders Club Hoodie",
    handle: "founders-club-hoodie-women",
    description:
      "Vintage washed, frayed heavyweight fleece. 10.6 oz — the anchor piece of the Founders Collection. Limited supply.",
    imageUrl: "/founders/woman-front.jpg", imageAlt: "Founders Club Hoodie",
    images: ["/founders/woman-front.jpg", "/founders/woman-back.jpg", "/founders/woman-seated.jpg"],
    model: "/founders/woman-front.jpg",
    minPrice: "$99.99", currency: "USD", hasOptions: true,
    badge: "Founders Collection",
    gender: "women", type: "Hoodies",
    variants: SIZES.map((s, i) =>
      V(["54121865806103","54121865838871","54121865871639","54121865904407","54121865937175"][i], `Black / ${s}`, "$99.99"),
    ),
  },
  {
    id: FOUNDERS_SWEATPANTS_W,
    title: "Founders Club Sweatpants",
    handle: "founders-club-sweatpants-women",
    description:
      "Straight-leg heavyweight sweatpant, 12.7 oz brushed cotton blend. Built to be lived in. Limited supply.",
    imageUrl: "/founders/woman-front.jpg", imageAlt: "Founders Club Sweatpants",
    images: ["/founders/woman-front.jpg", "/founders/woman-back.jpg", "/founders/woman-pants.jpg", "/founders/woman-seated.jpg"],
    model: "/founders/woman-front.jpg",
    flat: "/founders/woman-pants.jpg",
    minPrice: "$79.99", currency: "USD", hasOptions: true,
    badge: "Founders Collection",
    gender: "women", type: "Sweatpants",
    variants: SIZES.map((s, i) =>
      V(["54121874882839","54121874915607","54121874948375","54121874981143","54121875013911"][i], `Black / ${s}`, "$79.99"),
    ),
  },
];

/* ---------- existing catalog products, re-skinned for the drop ---------- */
export const FOUNDERS_OVERRIDES: Array<Partial<ShopProduct> & { id: string }> = [
  {
    id: FOUNDERS_TEE,
    title: "Founders Club Tee",
    description:
      "Essential heavyweight cotton tee, 9.7 oz, drop shoulder. Black. XS–2XL. Limited supply.",
    imageUrl: TEE_IMGS[0], imageAlt: "Founders Club Tee",
    images: TEE_IMGS,
    colorImages: undefined,
    minPrice: "$59.99",
    badge: "Founders Collection",
    variants: [
      ["53669577097495", "Black / XS"], ["53669577130263", "Black / S"],
      ["53669577163031", "Black / M"], ["53669577195799", "Black / L"],
      ["53669577228567", "Black / XL"], ["53669577261335", "Black / 2XL"],
    ].map(([id, title]) => V(id, title, "$59.99")),
  },
  {
    id: FOUNDERS_YOGA,
    title: "Founders Club Yoga Shorts",
    description:
      "High-rise, second-skin nylon/spandex short. Black. Sizes 4–12. Limited supply.",
    imageUrl: YOGA_IMGS[0], imageAlt: "Founders Club Yoga Shorts",
    images: YOGA_IMGS,
    colorImages: undefined,
    minPrice: "$49.99",
    badge: "Founders Collection",
    variants: [
      ["53967368487191", "Black / 4"], ["53967368519959", "Black / 6"],
      ["53967368552727", "Black / 8"], ["53967368585495", "Black / 10"],
      ["53967368618263", "Black / 12"],
    ].map(([id, title]) => V(id, title, "$49.99")),
  },
  // Second wave (July 21). These three already existed in the catalog from an
  // earlier Shopify sync under old names/prices, so they're patched here rather
  // than pushed as new — a duplicate push would be shadowed by products.find().
  {
    id: FOUNDERS_ATHSHORTS,
    title: "Founders Club Athletic Shorts",
    description:
      "Loose-fit performance short, quick-dry poly/elastane. Made for the gym and the run. Black. S–2XL. Limited supply.",
    imageUrl: ATHSHORTS_IMGS[0], imageAlt: "Founders Club Athletic Shorts",
    images: ATHSHORTS_IMGS,
    colorImages: undefined,
    minPrice: "$59.99",
    badge: "Founders Collection",
    variants: SIZES.map((s, i) =>
      V(["53664779206935","53664779239703","53664779272471","53664779305239","53664779338007"][i], `Black / ${s}`, "$59.99"),
    ),
  },
  {
    id: FOUNDERS_TANK,
    title: "Founders Club Washed Tank",
    description:
      "Snow-washed, frayed-hem tank. Heavyweight 8.1 oz cotton. Black or Light Gray. M–2XL. Limited supply.",
    imageUrl: TANK_IMGS[0], imageAlt: "Founders Club Washed Tank",
    images: TANK_IMGS,
    // Product-only shot for "Style With" — the Black flat front (last image is
    // the gray colorway, so pin it to Black to match the default).
    flat: TANK_IMGS[2],
    // Click a color, the main photo swaps to that colorway.
    colorImages: { "Black": TANK_BLACK, "Light Gray": TANK_GRAY },
    minPrice: "$49.99",
    badge: "Founders Collection",
    // Black listed first so it's the default colorway, matching the lead shot.
    variants: [
      ["53666213429527", "Black / M"], ["53666213462295", "Black / L"],
      ["53666213495063", "Black / XL"], ["53666213527831", "Black / 2XL"],
      ["53666213298455", "Light Gray / M"], ["53666213331223", "Light Gray / L"],
      ["53666213363991", "Light Gray / XL"], ["53666213396759", "Light Gray / 2XL"],
    ].map(([id, title]) => V(id, title, "$49.99")),
  },
  {
    id: FOUNDERS_SPORTCROP,
    title: "Founders Club Sport Crop",
    description:
      "Fitted sport crop, second-skin rayon/spandex. Round neck, cropped. Black. S–XL. Limited supply.",
    imageUrl: SPORTCROP_IMGS[0], imageAlt: "Founders Club Sport Crop",
    images: SPORTCROP_IMGS,
    colorImages: undefined,
    minPrice: "$49.99",
    badge: "Founders Collection",
    variants: [
      ["53664905363735", "Black / S"], ["53664905396503", "Black / M"],
      ["53664905429271", "Black / L"], ["53664905462039", "Black / XL"],
    ].map(([id, title]) => V(id, title, "$49.99")),
  },
  {
    // Founders leggings — replaces the old 6-color $49.99 leggings entry.
    id: FOUNDERS_LEGGINGS,
    title: "Founders Club Yoga Leggings",
    description:
      "High-rise, full-length legging. Second-skin nylon/spandex, squat-proof. Black. S–XL. Limited supply.",
    imageUrl: LEGGINGS_IMGS[0], imageAlt: "Founders Club Yoga Leggings",
    images: LEGGINGS_IMGS,
    colorImages: undefined,
    minPrice: "$59.99",
    badge: "Founders Collection",
    variants: [
      ["53967601533207", "Black / S"], ["53967601565975", "Black / M"],
      ["53967601598743", "Black / L"], ["53967601631511", "Black / XL"],
    ].map(([id, title]) => V(id, title, "$59.99")),
  },
];
