import { ImageResponse } from "next/og";

// Link-preview banner — Fear of God–style campaign image with the wordmark.
export const runtime = "edge";
export const alt = "One Mission Collection — Built for More";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HERO =
  "https://cdn.shopify.com/s/files/1/1016/0406/5559/files/ChatGPT_Image_Jul_15_2026_03_06_23_PM_1.png?v=1784151755";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#151310", fontFamily: "sans-serif" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover", objectPosition: "center 22%" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 600, letterSpacing: 22, paddingLeft: 22 }}>ONEMISSION</div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 16, marginTop: 18, paddingLeft: 16, opacity: 0.9 }}>MATTHEW 18:13</div>
          <div style={{ display: "flex", width: 64, height: 2, background: "rgba(255,255,255,0.7)", margin: "34px 0" }} />
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 10, paddingLeft: 10, opacity: 0.92 }}>BUILT FOR MORE</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
