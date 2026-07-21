"use client";

import Link from "next/link";
import { featuredProducts, DROP_MODE } from "@/data/products";
import { ProductGrid } from "./ProductGrid";
import { CountdownHero } from "./CountdownHero";

const IMG = "https://cdn.shopify.com/s/files/1/1016/0406/5559/files";

function Editorial({
  image, alt, over, title, sub, cta, href, rev = false, contain = false,
}: {
  image: string; alt: string; over: string; title: string; sub?: string;
  cta: string; href: string; rev?: boolean; contain?: boolean;
}) {
  return (
    <section className={`ed rvl${rev ? " ed-rev" : ""}`}>
      <div className="ed-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`ed-img${contain ? " contain" : ""}`} src={image} alt={alt} />
      </div>
      <div className="ed-scrim" />
      <div className="ed-copy">
        <div className="ed-over">{over}</div>
        <h2 className="ed-title">{title}</h2>
        {sub && <p className="ed-sub">{sub}</p>}
        <Link className="ed-cta" href={href}>{cta}</Link>
      </div>
    </section>
  );
}

export function HomeLanding() {
  return (
    <div>

      {/* HERO — Founders Collection countdown (auto-opens at launch) */}
      <CountdownHero />

      {/* Old brand banner + Men/Women split removed while the site is
          centered on the Founders Collection drop. */}

      {!DROP_MODE && (<>
      {/* COLLAB */}
      <Editorial
        image={`${IMG}/c586999976a045fb935481add78bbc2f.png?v=1784163502`}
        alt="OM x One Mission"
        over="Collaboration"
        title="OM × One Mission"
        sub="A washed, hand-painted capsule. Limited run."
        cta="Shop the Drop"
        href="/product/10410152689943"
      />

      {/* SUMMER */}
      <Editorial
        rev
        image={`${IMG}/ChatGPT_Image_Jul_15_2026_03_27_24_PM.png?v=1784151787`}
        alt="Summer"
        over="The Warm Weather Edit"
        title="Summer &apos;26"
        sub="Quick-dry swim and lightweight layers."
        cta="Shop Swim"
        href="/product/10410367385879"
      />
      </>)}

      {/* FEATURED PRODUCTS */}
      <section id="featured" className="rvl mx-auto max-w-site px-5 py-20 sm:px-8 sm:py-28">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="label" style={{ color: "#8c857a" }}>The Drop</div>
          <h2 style={{ marginTop: 12, fontSize: "clamp(24px,3vw,38px)", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 400 }}>The Founders Collection</h2>
          <p style={{ marginTop: 14, fontSize: 14, color: "#8c857a", letterSpacing: ".02em" }}>A limited first release. Launching July 27.</p>
        </div>
        <ProductGrid products={featuredProducts()} />
      </section>

      {/* VERSE */}
      <section className="rvl" style={{ background: "#efece4", color: "#17140f", padding: "16vh 24px", textAlign: "center" }}>
        <div className="label" style={{ color: "#8c857a", marginBottom: 32 }}>The Mission</div>
        <blockquote style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: "clamp(24px,3.4vw,44px)", lineHeight: 1.3, maxWidth: 880, margin: "0 auto", letterSpacing: ".01em" }}>
          “And if he should find it, truly I say to you, he rejoices over it more than over the ninety-nine that never went astray.”
        </blockquote>
        <div style={{ marginTop: 32, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "#8c857a" }}>Matthew 18:13</div>
        <div style={{ marginTop: 46, fontSize: "clamp(20px,2.6vw,32px)", letterSpacing: ".18em", textTransform: "uppercase" }}>One Found. One Mission.</div>
      </section>
    </div>
  );
}
