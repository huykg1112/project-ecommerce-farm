import { Category } from "@/lib_dashboard/types/category";
import { Manufacturer } from "@/lib_dashboard/types/manufacturer";
import { Product } from "@/lib_dashboard/types/product";
import { Voucher } from "@/types/entities";

export interface CategoriesSectionProps {
  categories: Category[];
  loading: boolean;
}

export interface VouchersSectionProps {
  vouchers: Voucher[];
  loading: boolean;
}

export interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
}

export interface NewProductsSectionProps {
  products: any[];
  loading: boolean;
}

export interface SeasonalProductsSectionProps {
  products: any[];
  loading: boolean;
}

export interface ManufacturersSectionProps {
  manufacturers: Manufacturer[];
  loading: boolean;
}
interface WhyChooseUsCard {
  title: string;
  icon: any;
  description: string;
}
export interface WhyChooseUsSectionData {
  title: string;
  cards: WhyChooseUsCard[];
}
