import type { Metadata } from "next";
import { StoreView } from "@/components/StoreView";
import { featuredProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "The Founders Collection",
  description:
    "The first drop from One Mission Collection — limited-run, faith-driven heavyweight streetwear. Hoodies, sweats, tees, and more. Leaving the 99 to find the 1.",
  alternates: { canonical: "/featured" },
};

export default function FeaturedPage() {
  return <StoreView products={featuredProducts()} active="/featured" />;
}
