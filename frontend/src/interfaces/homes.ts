export interface CategoriesSectionProps {
  categories: any[];
}

export interface FeaturedProductsSectionProps {
  products: any[];
}

export interface NewProductsSectionProps {
  products: any[];
}

export interface SeasonalProductsSectionProps {
  products: any[];
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
