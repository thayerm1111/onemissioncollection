import { ImageResponse } from "next/og";

// Link-preview banner for the store — featured drop.
export const runtime = "edge";
export const alt = "One Mission Collection — Featured Drop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HERO =
  "https://cdn.shopify.com/s/files/1/1016/0406/5559/files/ba844c2c993a4650b666ad4fb5a3496d.png?v=1783882713";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: "#101010",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "76px",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 24, letterSpacing: 8, color: "#8a8a8a" }}>ONE MISSION</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: 4, marginTop: 2 }}>COLLECTION</div>
          <div style={{ display: "flex", width: 90, height: 3, background: "#101010", margin: "34px 0" }} />
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#8a8a8a" }}>FEATURED DROP</div>
          <div style={{ fontSize: 46, fontWeight: 600, marginTop: 10 }}>The Statement Hoodie</div>
          <div style={{ fontSize: 30, color: "#8a8a8a", marginTop: 8 }}>From $125</div>
        </div>
        <div
          style={{
            display: "flex",
            width: 520,
            height: "100%",
            background: "#f4f4f2",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO} width={520} height={630} style={{ objectFit: "cover" }} alt="" />
        </div>
      </div>
    ),
    { ...size }
  );
}
