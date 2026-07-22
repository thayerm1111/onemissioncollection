import type { Metadata } from "next";
import { StoreView } from "@/components/StoreView";
import { featuredProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "The Founders Collection — One Mission Collection",
};

export default function FeaturedPage() {
  return <StoreView products={featuredProducts()} active="/featured" />;
}
