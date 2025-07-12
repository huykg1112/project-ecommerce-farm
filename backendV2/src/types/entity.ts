export interface Category {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductType {
  product_type_id: string;
  type_name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BatchProduct {
  batch_id: string;
  // product: Product;
  product_types: ProductType[];
  // invenstory: Invenstory;
  batch_number: string;
  quantity: number;
  manufactured_date: Date;
  expiry_date: Date;
}

export interface Manufacturer {
  id: string;
  name: string;
  description: string;
  logo: string;
}

export interface Review {
  review_id: string;

  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

export interface Ingredient {
  ingredient_id: string;
  ingredient_name: string;
  description: string;
  hazard_level: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Disease {
  disease_id: string;
  disease_name: string;
  description: string;
  is_active: boolean;
}

export interface Product {
  product_id: string;
  product_name: string;
  description: string;
  usage_instructions: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  categories: Category[];
  manufacturer: Manufacturer;
  // distributor: User;
  reviews: Review[];
  product_ingredients: Ingredient[];
  productDiseases: Disease[];
  unit_product_price: number;
}
