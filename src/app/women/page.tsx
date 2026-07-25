import { StoreView } from "@/components/StoreView";
import { productsFor } from "@/data/products";

export const metadata = {
  title: "Women's Collection",
  description:
    "Women's faith-driven streetwear from One Mission Collection — hoodies, sweats, crops, leggings, and more. Shop the limited Founders Collection.",
  alternates: { canonical: "/women" },
};

export default function WomenPage() {
  return <StoreView products={productsFor("women")} active="/women" />;
}
