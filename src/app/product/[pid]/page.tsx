import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByPid, pairedProducts, bundleProducts } from "@/data/products";
import { ProductDetail } from "@/components/ProductDetail";

export function generateMetadata({ params }: { params: { pid: string } }): Metadata {
  const product = getProductByPid(params.pid);
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.description || product.title,
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
  return <ProductDetail product={product} pairs={pairedProducts(product)} bundleItems={bundleProducts(product)} />;
}
