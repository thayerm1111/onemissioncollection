import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntroSplash } from "@/components/IntroSplash";
import { CartProvider } from "@/components/cart/CartProvider";

const SITE_URL = "https://onemissioncollection.com";

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
        <CartProvider>
          <IntroSplash />
          <Header />
          <main className="min-h-[70vh] pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
