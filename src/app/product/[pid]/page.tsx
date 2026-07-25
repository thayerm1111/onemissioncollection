import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByPid, pairedProducts, bundleProducts } from "@/data/products";
import { ProductDetail } from "@/components/ProductDetail";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL = "https://onemissioncollection.com";

// "$99.99" -> "99.99" for schema.org Offer.price (numeric string, no symbol).
const numericPrice = (p?: string) => (p || "").replace(/[^0-9.]/g, "") || "0";

export function generateMetadata({ params }: { params: { pid: string } }): Metadata {
  const product = getProductByPid(params.pid);
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.description || product.title,
    alternates: { canonical: `/product/${params.pid}` },
    openGraph: {
      title: product.title,
      description: product.description || product.title,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default function ProductPage({ params }: { params: { pid: string } }) {
  const product = getProductByPid(params.pid);
  if (!product) notFound();

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [],
    brand: { "@type": "Brand", name: "One Mission Collection" },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "USD",
      price: numericPrice(product.minPrice),
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/product/${params.pid}`,
    },
  };

  return (
    <>
      <JsonLd data={productLd} />
      <ProductDetail product={product} pairs={pairedProducts(product)} bundleItems={bundleProducts(product)} />
    </>
  );
}
