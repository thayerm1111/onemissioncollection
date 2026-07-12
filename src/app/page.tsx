import { StoreView } from "@/components/StoreView";
import { featuredProducts } from "@/data/products";

export default function HomePage() {
  return <StoreView products={featuredProducts()} active="/" />;
}
