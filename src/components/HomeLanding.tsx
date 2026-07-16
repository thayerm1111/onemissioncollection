"use client";

import Link from "next/link";
import { featuredProducts } from "@/data/products";
import { ProductGrid } from "./ProductGrid";

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

      {/* HERO */}
      <section className="ed ed-hero rvl">
        <div className="ed-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ed-img" src={`${IMG}/ChatGPT_Image_Jul_15_2026_03_06_23_PM_1.png?v=1784151755`} alt="One Mission — The Fit" />
        </div>
        <div className="ed-scrim" />
        <div className="ed-copy">
          <div className="ed-over">One Mission — Fall / Winter &apos;26</div>
          <h1 className="ed-title">Built for More</h1>
          <p className="ed-sub">Washed heavyweight staples for the ones who carry the mission.</p>
          <a className="ed-cta" href="#featured">Shop the Collection</a>
        </div>
      </section>

      {/* BRAND BANNER */}
      <section className="rvl" style={{ position: "relative", height: "62vh", minHeight: 420, width: "100%", overflow: "hidden", background: "#0f0d0b" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/ed21309b808f41a2b88978fc064bb627.png?v=1784171028`} alt="One Mission" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%", opacity: 0.45 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "#f5f2ec", padding: "0 24px" }}>
          <div style={{ fontSize: "clamp(38px,8vw,104px)", letterSpacing: ".3em", fontWeight: 500, lineHeight: 1, paddingLeft: ".3em" }}>ONEMISSION</div>
          <div style={{ fontSize: 11, letterSpacing: ".5em", marginTop: 14, opacity: 0.85, paddingLeft: ".5em" }}>MATTHEW 18:13</div>
          <p style={{ marginTop: 24, fontSize: 13, letterSpacing: ".06em", opacity: 0.8, fontWeight: 300, maxWidth: 460 }}>Faith-built apparel. Washed, heavyweight, and made to last — for the one worth going after.</p>
        </div>
      </section>

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

      {/* MEN / WOMEN SPLIT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="om-split">
        <section className="rvl" style={{ position: "relative", height: "90vh", minHeight: 560, overflow: "hidden", background: "#d9d6cf" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/ChatGPT_Image_Jul_15_2026_03_06_23_PM_2.png?v=1784151754`} alt="Men" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", color: "#fff", paddingBottom: "7vh" }}>
            <h3 style={{ fontSize: "clamp(24px,3vw,42px)", letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 400, margin: 0 }}>Men</h3>
            <Link href="/men" style={{ marginTop: 16, fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "#fff", borderBottom: "1px solid rgba(255,255,255,.6)", paddingBottom: 5, textDecoration: "none" }}>Shop Men</Link>
          </div>
        </section>
        <section className="rvl" style={{ position: "relative", height: "90vh", minHeight: 560, overflow: "hidden", background: "#d9d6cf" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/6580d1a95b6e4ff181020c414ea7c1d3.png?v=1784167477`} alt="Women" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 18%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", color: "#fff", paddingBottom: "7vh" }}>
            <h3 style={{ fontSize: "clamp(24px,3vw,42px)", letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 400, margin: 0 }}>Women</h3>
            <Link href="/women" style={{ marginTop: 16, fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "#fff", borderBottom: "1px solid rgba(255,255,255,.6)", paddingBottom: 5, textDecoration: "none" }}>Shop Women</Link>
          </div>
        </section>
      </div>

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

      {/* FEATURED PRODUCTS */}
      <section id="featured" className="rvl mx-auto max-w-site px-5 py-20 sm:px-8 sm:py-28">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="label" style={{ color: "#8c857a" }}>The Edit</div>
          <h2 style={{ marginTop: 12, fontSize: "clamp(24px,3vw,38px)", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 400 }}>Featured</h2>
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
