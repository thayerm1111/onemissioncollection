"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { featuredProducts } from "@/data/products";
import { ProductGrid } from "./ProductGrid";

const IMG = "https://cdn.shopify.com/s/files/1/1016/0406/5559/files";

function Panel({
  image, position = "center 30%", overline, title, sub, cta, href, dark = true, contain = false, bg = "#e7e4de",
}: {
  image: string; position?: string; overline?: string; title: string; sub?: string;
  cta: string; href: string; dark?: boolean; contain?: boolean; bg?: string;
}) {
  const color = dark ? "#ffffff" : "#17140f";
  const border = dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.4)";
  return (
    <section className="rvl" style={{ position: "relative", height: "100vh", minHeight: 600, width: "100%", overflow: "hidden", background: bg }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: contain ? "contain" : "cover", objectPosition: position }} />
      {dark && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.34) 0%,rgba(0,0,0,.05) 24%,rgba(0,0,0,0) 52%,rgba(0,0,0,.5) 100%)" }} />}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: contain ? "center" : "flex-end", alignItems: "center", textAlign: "center", color, padding: "0 24px 9vh" }}>
        {overline && <div style={{ fontSize: 11, letterSpacing: ".34em", textTransform: "uppercase", opacity: dark ? .9 : .65, marginBottom: 16 }}>{overline}</div>}
        <h2 style={{ fontSize: "clamp(32px,5.4vw,76px)", letterSpacing: ".13em", textTransform: "uppercase", fontWeight: 400, lineHeight: 1, margin: 0 }}>{title}</h2>
        {sub && <p style={{ marginTop: 15, fontSize: 13, letterSpacing: ".05em", opacity: .92, fontWeight: 300, maxWidth: 420 }}>{sub}</p>}
        <Link href={href} style={{ display: "inline-block", marginTop: 24, fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color, borderBottom: `1px solid ${border}`, paddingBottom: 5, textDecoration: "none" }}>{cta}</Link>
      </div>
    </section>
  );
}

export function HomeLanding() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.18 });
    ref.current?.querySelectorAll(".rvl").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <style>{`.rvl{opacity:0;transform:translateY(24px);transition:opacity 1s ease,transform 1s ease}.rvl.in{opacity:1;transform:none}`}</style>

      {/* HERO — pulled under the transparent header */}
      <section className="rvl" style={{ position: "relative", height: "100vh", minHeight: 640, width: "100%", overflow: "hidden", marginTop: -64, background: "#dedbd4" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/ChatGPT_Image_Jul_15_2026_03_06_23_PM_1.png?v=1784151755`} alt="One Mission — The Fit" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.42) 0%,rgba(0,0,0,.08) 22%,rgba(0,0,0,0) 50%,rgba(0,0,0,.55) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", textAlign: "center", color: "#fff", padding: "0 24px 9vh" }}>
          <div style={{ fontSize: 11, letterSpacing: ".36em", textTransform: "uppercase", opacity: .92, marginBottom: 18 }}>One Mission — Fall / Winter &apos;26</div>
          <h1 style={{ fontSize: "clamp(40px,7vw,96px)", letterSpacing: ".13em", textTransform: "uppercase", fontWeight: 400, lineHeight: .96, margin: 0 }}>Built for More</h1>
          <p style={{ marginTop: 16, fontSize: 13, letterSpacing: ".05em", opacity: .92, fontWeight: 300, maxWidth: 440 }}>Washed heavyweight staples for the ones who carry the mission.</p>
          <a href="#featured" style={{ display: "inline-block", marginTop: 26, fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "#fff", borderBottom: "1px solid rgba(255,255,255,.6)", paddingBottom: 5, textDecoration: "none" }}>Shop the Collection</a>
        </div>
      </section>

      {/* BRAND BANNER — image-led brand moment */}
      <section className="rvl" style={{ position: "relative", height: "68vh", minHeight: 440, width: "100%", overflow: "hidden", background: "#0f0d0b" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/ed21309b808f41a2b88978fc064bb627.png?v=1784171028`} alt="One Mission" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%", opacity: .5 }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,13,11,.35)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "#f5f2ec", padding: "0 24px" }}>
          <div style={{ fontSize: "clamp(40px,9vw,120px)", letterSpacing: ".3em", fontWeight: 500, lineHeight: 1, paddingLeft: ".3em" }}>ONEMISSION</div>
          <div style={{ fontSize: 11, letterSpacing: ".5em", marginTop: 14, opacity: .85, paddingLeft: ".5em" }}>MATTHEW 18:13</div>
          <p style={{ marginTop: 26, fontSize: 13, letterSpacing: ".06em", opacity: .8, fontWeight: 300, maxWidth: 460 }}>Faith-built apparel. Washed, heavyweight, and made to last — for the one worth going after.</p>
        </div>
      </section>

      {/* COLLAB */}
      <Panel
        image={`${IMG}/c586999976a045fb935481add78bbc2f.png?v=1784163502`}
        position="center 20%"
        overline="Collaboration"
        title="OM × One Mission"
        sub="A washed, hand-painted capsule. Limited run."
        cta="Shop the Drop"
        href="/product/10410152689943"
      />

      {/* MEN / WOMEN SPLIT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="om-split">
        <section className="rvl" style={{ position: "relative", height: "90vh", minHeight: 560, overflow: "hidden", background: "#dedbd4" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/ChatGPT_Image_Jul_15_2026_03_06_23_PM_2.png?v=1784151754`} alt="Men" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 26%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", color: "#fff", paddingBottom: "7vh" }}>
            <h3 style={{ fontSize: "clamp(24px,3vw,42px)", letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 400, margin: 0 }}>Men</h3>
            <Link href="/men" style={{ marginTop: 16, fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "#fff", borderBottom: "1px solid rgba(255,255,255,.6)", paddingBottom: 5, textDecoration: "none" }}>Shop Men</Link>
          </div>
        </section>
        <section className="rvl" style={{ position: "relative", height: "90vh", minHeight: 560, overflow: "hidden", background: "#dedbd4" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/6580d1a95b6e4ff181020c414ea7c1d3.png?v=1784167477`} alt="Women" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 22%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", color: "#fff", paddingBottom: "7vh" }}>
            <h3 style={{ fontSize: "clamp(24px,3vw,42px)", letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 400, margin: 0 }}>Women</h3>
            <Link href="/women" style={{ marginTop: 16, fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "#fff", borderBottom: "1px solid rgba(255,255,255,.6)", paddingBottom: 5, textDecoration: "none" }}>Shop Women</Link>
          </div>
        </section>
      </div>

      {/* STATEMENT — back print on light */}
      <Panel
        image={`${IMG}/d01900bff2944a9995885855714bd08d.png?v=1783828340`}
        contain
        bg="#e7e4de"
        dark={false}
        overline="The Statement"
        title="Wear the Verse"
        cta="Shop Hoodies"
        href="/men"
      />

      {/* SUMMER */}
      <Panel
        image={`${IMG}/ChatGPT_Image_Jul_15_2026_03_27_24_PM.png?v=1784151787`}
        position="center 28%"
        overline="The Warm Weather Edit"
        title="Summer &apos;26"
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
