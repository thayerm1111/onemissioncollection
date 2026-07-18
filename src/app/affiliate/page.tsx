import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliates",
  description:
    "Join the One Mission Collection affiliate program. Earn 15% on every order you refer, and give your audience 10% off.",
};

const REGISTER = "https://af.uppromote.com/k3vbq8-x0/register";
const LOGIN = "https://af.uppromote.com/k3vbq8-x0";

const INK = "#17140f";
const CREAM = "#efece4";
const MUTE = "#8c857a";

function Btn({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
}) {
  const base: React.CSSProperties = {
    display: "inline-block",
    fontSize: 11,
    letterSpacing: ".24em",
    textTransform: "uppercase",
    padding: "16px 34px",
    textDecoration: "none",
    transition: "opacity .2s",
  };
  const style =
    variant === "solid"
      ? { ...base, background: INK, color: "#f5f2ec" }
      : { ...base, color: INK, border: `1px solid rgba(0,0,0,.32)` };
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {children}
    </a>
  );
}

export default function AffiliatePage() {
  return (
    <div>
      {/* HERO */}
      <section
        style={{
          background: CREAM,
          color: INK,
          textAlign: "center",
          padding: "16vh 24px 14vh",
        }}
      >
        <div
          className="mx-auto max-w-site"
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: ".34em",
              textTransform: "uppercase",
              color: MUTE,
              marginBottom: 22,
            }}
          >
            One Mission Collection — Partner Program
          </div>
          <h1
            style={{
              fontSize: "clamp(38px,6vw,82px)",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              fontWeight: 400,
              lineHeight: 1.02,
              margin: 0,
            }}
          >
            Earn 15%
            <br />
            On Every Order
          </h1>
          <p
            style={{
              marginTop: 22,
              fontSize: 14,
              letterSpacing: ".04em",
              fontWeight: 300,
              maxWidth: 520,
              lineHeight: 1.6,
              color: "#3a352d",
            }}
          >
            Share the collection with your audience and earn 15% on every sale
            you refer — plus your followers get 10% off with your code. Free to
            join, no minimums. Carry the mission and get paid for it.
          </p>
          <div
            style={{
              marginTop: 34,
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Btn href={REGISTER}>Become an Affiliate</Btn>
            <Btn href={LOGIN} variant="ghost">
              Affiliate Login
            </Btn>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-site px-5 py-24 sm:px-8">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="label" style={{ color: MUTE }}>
            The Program
          </div>
          <h2
            style={{
              marginTop: 12,
              fontSize: "clamp(24px,3vw,38px)",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            How It Works
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gap: 40,
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          }}
        >
          {[
            {
              n: "01",
              t: "Apply",
              d: "Sign up in under a minute. Once approved, you'll get your own referral link and personal discount code.",
            },
            {
              n: "02",
              t: "Share",
              d: "Post your link or code anywhere — Instagram, TikTok, your group, or one-to-one. Your code gives followers 10% off, and every click is tracked.",
            },
            {
              n: "03",
              t: "Earn 15%",
              d: "Get 15% of every order that comes through you. Track sales and earnings live, with payouts sent regularly.",
            },
          ].map((s) => (
            <div key={s.n} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: ".3em",
                  color: MUTE,
                  marginBottom: 16,
                }}
              >
                {s.n}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {s.t}
              </h3>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  lineHeight: 1.65,
                  fontWeight: 300,
                  color: "#4a453d",
                  maxWidth: 320,
                  marginInline: "auto",
                }}
              >
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section
        style={{
          background: INK,
          color: "#f5f2ec",
          textAlign: "center",
          padding: "14vh 24px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: ".34em",
            textTransform: "uppercase",
            opacity: 0.7,
            marginBottom: 18,
          }}
        >
          One Found. One Mission.
        </div>
        <h2
          style={{
            fontSize: "clamp(26px,3.4vw,46px)",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Join The Movement
        </h2>
        <p
          style={{
            marginTop: 18,
            fontSize: 14,
            fontWeight: 300,
            opacity: 0.8,
            maxWidth: 440,
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          Turn your reach into a partnership. Apply today, give your audience 10%
          off, and start earning 15%.
        </p>
        <div style={{ marginTop: 32 }}>
          <a
            href={REGISTER}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontSize: 11,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              padding: "16px 34px",
              background: "#f5f2ec",
              color: INK,
              textDecoration: "none",
            }}
          >
            Become an Affiliate
          </a>
        </div>
      </section>
    </div>
  );
}
