import { StoreView } from "@/components/StoreView";
import { productsFor } from "@/data/products";

export const metadata = { title: "Accessories" };

export default function AccessoriesPage() {
  return <StoreView products={productsFor("accessories")} active="/accessories" />;
}
