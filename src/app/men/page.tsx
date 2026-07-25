import { StoreView } from "@/components/StoreView";
import { productsFor } from "@/data/products";

export const metadata = {
  title: "Men's Collection",
  description:
    "Men's faith-driven streetwear from One Mission Collection — heavyweight hoodies, sweats, tees, and shorts built to be lived in. Shop the Founders Collection.",
  alternates: { canonical: "/men" },
};

export default function MenPage() {
  return <StoreView products={productsFor("men")} active="/men" />;
}
