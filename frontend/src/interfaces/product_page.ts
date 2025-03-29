import { FilterState, SortOption } from "@/types/products";

export interface ActiveFiltersProps {
  activeFilters: JSX.Element[];
  clearAllFilters: () => void;
  isMobile?: boolean;
}

export interface FiltersSidebarProps {
  filters: any;
  handleFilterChange: (filterType: FilterState, value: any) => void;
  handleCategoryChange: (category: string) => void;
  handleSellerChange: (seller: string) => void;
  handleRatingChange: (rating: number | null) => void;
  handlePriceChange: (value: number[]) => void;
  clearAllFilters: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categories: any[];
  sellers: string[];
  minPrice: number;
  maxPrice: number;
}

export interface ProductListProps {
  sortedProducts: any[];
  clearAllFilters: () => void;
}

export interface SortSelectProps {
  sort: SortOption;
  setSort: (value: SortOption) => void;
  width?: string;
}
export interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}
