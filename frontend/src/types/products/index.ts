// types/product.ts
export type FilterState = {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  sellers: string[];
  onSale: boolean;
};

export type SortOption =
  | "featured"
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "best-selling"
  | "rating";
