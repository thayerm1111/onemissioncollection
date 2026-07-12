import { StoreView } from "@/components/StoreView";
import { productsFor } from "@/data/products";

export const metadata = { title: "Men" };

export default function MenPage() {
  return <StoreView products={productsFor("men")} active="/men" />;
}
