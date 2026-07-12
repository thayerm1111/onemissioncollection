import { StoreView } from "@/components/StoreView";
import { productsFor } from "@/data/products";

export const metadata = { title: "Women" };

export default function WomenPage() {
  return <StoreView products={productsFor("women")} active="/women" />;
}
