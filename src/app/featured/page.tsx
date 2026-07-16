import { StoreView } from "@/components/StoreView";
import { featuredProducts } from "@/data/products";

export default function FeaturedPage() {
  return <StoreView products={featuredProducts()} active="/featured" />;
}
