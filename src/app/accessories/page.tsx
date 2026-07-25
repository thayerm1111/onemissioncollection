import { StoreView } from "@/components/StoreView";
import { productsFor } from "@/data/products";

export const metadata = {
  title: "Accessories",
  description:
    "Accessories from One Mission Collection — finish the fit. Explore the faith-driven Founders Collection.",
  alternates: { canonical: "/accessories" },
};

export default function AccessoriesPage() {
  return <StoreView products={productsFor("accessories")} active="/accessories" />;
}
