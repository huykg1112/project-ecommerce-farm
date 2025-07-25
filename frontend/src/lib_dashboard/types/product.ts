import { Review } from "@/interfaces";
import { ActiveIngredient } from "@/types/entities";
import { BatchProduct } from "./batch-product";
import { Category } from "./category";
import { DiseaseTableData } from "./disease";
import { Manufacturer } from "./manufacturer";
import { User } from "./user";

export interface Product {
  product_id: string;
  product_name: string;
  description?: string;
  usage_instructions?: string;
  unit_product_price: number;
  total_saled?: number; // Số lượng đã bán
  is_active: boolean;
  is_deleted?: boolean;
  created_at: Date;
  updated_at?: Date;
  batches?: BatchProduct[];
  categories: Category[];
  manufacturer?: Manufacturer;
  distributor?: ProductDistributor;
  images: ProductImage[];
  reviews: Review[];
  avg_rating: number | null;
  product_ingredients: ProductIngredient[];
  productDiseases: ProductDisease[];
}

// Supporting interfaces - mapping theo serializeProduct() từ B

export interface ProductDistributor {
  user_id: string;
  full_name: string;
  invenstory?: Invenstory;
  is_active: boolean;
  is_deleted?: boolean;
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
  ingredient: ActiveIngredient;
}

export interface ProductDisease {
  disease_id: string;
  disease_name: string;
  is_primary: boolean;
  disease: DiseaseTableData;
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
  ingredient_id_primary?: string;
  disease_id_primary?: string;
  is_active?: boolean;
  product_images?: File[]; // For image uploads
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
  ingredient_id_primary?: string;
  disease_id_primary?: string;
  product_images?: File[]; // For image uploads
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
  ingredient_id_primary?: string;
  disease_id_primary?: string;
  is_active: boolean;
  product_images?: File[]; // For image uploads
}

export interface ProductFormErrors {
  product_name?: string;
  description?: string;
  usage_instructions?: string;
  unit_product_price?: string;
  category_ids?: string[];
  manufacturer_id?: string;
  ingredient_ids?: string[];
  disease_ids?: string[];
  is_active?: boolean;
  // images?: string[];
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

export interface InvenstoryClient {
  distributor: User;
  invenstory_id: string;
  batch_products?: BatchProduct[];
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
