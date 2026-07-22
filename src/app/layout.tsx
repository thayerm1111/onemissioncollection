import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntroSplash } from "@/components/IntroSplash";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { PromoPopup } from "@/components/PromoPopup";

const SITE_URL = "https://onemissioncollection.com";

// Meta Pixel — "One Mission Collection" dataset. Fires PageView on every load,
// which builds the retargeting audience and feeds ad optimization. Add-to-cart,
// view-content and purchase events call window.fbq('track', ...) elsewhere.
const META_PIXEL_ID = "1711643830135318";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "One Mission Collection",
    template: "%s | One Mission Collection",
  },
  description: "Official One Mission apparel — hoodies, tees, sweats, and more.",
  openGraph: {
    title: "One Mission Collection",
    description: "Official One Mission apparel — hoodies, tees, sweats, and more.",
    url: SITE_URL,
    siteName: "One Mission Collection",
    type: "website",
  },
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
