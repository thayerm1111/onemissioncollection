import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntroSplash } from "@/components/IntroSplash";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { PromoPopup } from "@/components/PromoPopup";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL = "https://onemissioncollection.com";

// Meta Pixel — "One Mission Collection" dataset. Fires PageView on every load,
// which builds the retargeting audience and feeds ad optimization. Add-to-cart,
// view-content and purchase events call window.fbq('track', ...) elsewhere.
const META_PIXEL_ID = "1711643830135318";

// Klaviyo onsite (company Yq65z5). Enables Active-on-Site + Viewed-Product
// tracking (powers the Browse Abandonment flow) and on-site sign-up forms.
const KLAVIYO_COMPANY_ID = "Yq65z5";

// Shopify store domain — the backend this headless site checks out against.
// Used by the UpPromote affiliate pixel to tie referrals to the right store.
const SHOPIFY_STORE_DOMAIN = "1-mission-2.myshopify.com";

const SEO_DESCRIPTION =
  "Faith-driven streetwear for the ones who felt lost. Inspired by Matthew 18:13 — leaving the 99 to find the 1. Shop the Founders Collection.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "One Mission Collection — Faith-Driven Streetwear",
    template: "%s | One Mission Collection",
  },
  description: SEO_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "One Mission Collection — Faith-Driven Streetwear",
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    siteName: "One Mission Collection",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "One Mission Collection — Faith-Driven Streetwear",
    description: SEO_DESCRIPTION,
  },
};

// Site-wide structured data: the brand and the searchable site.
const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "One Mission Collection",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  slogan: "Leaving the 99 to find the 1.",
  sameAs: ["https://www.instagram.com/onemissioncollection"],
};
const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "One Mission Collection",
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
        </noscript>
        <Script
          id="klaviyo-onsite"
          strategy="afterInteractive"
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`}
        />
        {/* UpPromote affiliate tracking — headless / third-party-store install.
            This is UpPromote's official pixel for a custom storefront: it reads
            the affiliate referral when a visitor lands from an affiliate link,
            stores it first-party, and carries attribution through to Shopify's
            native checkout (this site checks out on the Shopify domain). `shop`
            must be the Shopify store domain UpPromote is installed on. This lets
            affiliate links point at onemissioncollection.com instead of the
            Shopify online store, while orders still credit the right affiliate. */}
        <Script
          id="uppromote-pixel"
          strategy="afterInteractive"
          src={`https://pixel.uppromote.com/collect/v1/collect?shop=${SHOPIFY_STORE_DOMAIN}`}
        />
        {/* Vercel Web Analytics — live visitor tracking. Starts collecting once
            Web Analytics is enabled for this project in the Vercel dashboard.
            Uses the framework-agnostic script (no npm dependency) to avoid any
            build/version risk. */}
        <Script
          id="vercel-insights"
          strategy="afterInteractive"
          src="/_vercel/insights/script.js"
        />
        <JsonLd data={ORG_LD} />
        <JsonLd data={WEBSITE_LD} />
        <AuthProvider>
          <CartProvider>
            <IntroSplash />
            <Header />
            <main className="min-h-[70vh] pt-16">{children}</main>
            <Footer />
            <PromoPopup />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
