export interface Product {
  product_id: string;
  product_name: string;
  description?: string;
  usage_instructions?: string;
  unit_product_price: number;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
  categories: ProductCategory[];
  manufacturer?: ProductManufacturer;
  distributor?: ProductDistributor;
  images: ProductImage[];
  reviews: ProductReview[];
  avg_rating: number | null;
  product_ingredients: ProductIngredient[];
  diseases: ProductDisease[];
}

// Supporting interfaces - mapping theo serializeProduct() từ BE
export interface ProductCategory {
  category_id: string;
  category_name: string;
}

export interface ProductManufacturer {
  id: string;
  name: string;
  logo?: string;
}

export interface ProductDistributor {
  distributor_id: string;
  full_name: string;
  invenstory?: Invenstory;
}

export interface ProductImage {
  image_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: Date;
}

export interface ProductReview {
  review_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
}

export interface ProductIngredient {
  ingredient_id: string;
  ingredient_name: string;
  is_primary: boolean;
}

export interface ProductDisease {
  disease_id: string;
  disease_name: string;
  is_primary: boolean;
}

// Request DTOs - mapping theo backend DTOs
export interface CreateProductRequest {
  product_name: string;
  description?: string;
  usage_instructions?: string;
  unit_product_price: number;
  category_ids: string[];
  manufacturer_id?: string;
  ingredient_ids?: string[];
  disease_ids?: string[];
  is_active?: boolean;
}

export interface UpdateProductRequest {
  product_name?: string;
  description?: string;
  usage_instructions?: string;
  unit_product_price?: number;
  category_ids?: string[];
  manufacturer_id?: string;
  ingredient_ids?: string[];
  disease_ids?: string[];
  is_active?: boolean;
}

export interface AdvancedProductFilterRequest extends ProductFilters {
  // Multi-selection cho advanced search
  category_ids?: string[];
  distributor_ids?: string[];
  ingredient_ids?: string[];
  disease_ids?: string[];
}

export interface BatchProductRequest {
  product_ids: string[];
}

export interface BatchToggleStatusRequest {
  product_ids: string[];
  is_active: boolean;
}

// Response interfaces
export interface ProductPaginationResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductStatsResponse {
  total_products: number;
  active_products: number;
  inactive_products: number;
  avg_price: number;
}

export interface BatchOperationResponse {
  message: string;
  affected_count?: number;
  success_ids?: string[];
  failed_ids?: string[];
}

// Filter interfaces
export interface ProductFilters {
  search?: string;
  category_id?: string;
  manufacturer_id?: string;
  distributor_id?: string;
  status?: "active" | "inactive" | "all";
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  rating_max?: number;
  sort_by?: "name" | "price" | "created_at" | "rating";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Form data interfaces
export interface ProductFormData {
  product_id?: string;
  product_name: string;
  description: string;
  usage_instructions: string;
  unit_product_price: number;
  category_ids: string[];
  manufacturer_id: string;
  ingredient_ids: string[];
  disease_ids: string[];
  is_active: boolean;
}

export interface ProductFormErrors {
  product_name?: string;
  description?: string;
  usage_instructions?: string;
  unit_product_price?: string;
  category_ids?: string;
  manufacturer_id?: string;
  ingredient_ids?: string;
  disease_ids?: string;
}

export interface Invenstory {
  invenstory_id: string;
  name?: string;
  business_license?: string;
  invenstory_address?: string;
  invenstory_img?: string;
  invenstory_lat?: string;
  invenstory_lng?: string;
  email?: string;
  created_at: Date;
  updated_at?: Date;
  is_active: boolean;
  is_deleted?: boolean;
}
