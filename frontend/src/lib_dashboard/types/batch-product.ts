import type { Product } from "./product";
import { Promotion } from "./promotion";

export interface ProductType {
  product_type_id: string;
  type_name: string;
  description?: string;
  is_active: boolean;
  is_deleted: boolean;
}

export interface BatchProduct {
  batch_id: string;
  product: Product;
  batch_number: string;
  quantity: number;
  manufactured_date: Date;
  expiry_date: Date;
  low_stock_threshold: number;
  unit_product_price: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
  invenstory?: {
    invenstory_id: string;
    warehouse_name: string;
  };
  product_types?: ProductType;
  promotions?: Promotion[];
}

export interface BatchProductFilters {
  search?: string;
  product_id?: string;
  product_type_id?: string;
  is_active?: boolean;
  expiring_soon_days?: number;
  low_stock?: boolean;
  batch_number?: string;
  from_date?: string;
  to_date?: string;
  stock_quantity_threshold?: number; // New property for stock quantity thresholds
  // New property for expiry date ranges
}

export interface CreateBatchProductDto {
  product_id?: string;
  invenstory_id?: string;
  batch_number: string;
  quantity: number;
  manufactured_date?: string;
  expiry_date: string;
  low_stock_threshold?: number;
  is_active?: boolean;
  product_type_ids?: string[];
  promotion_ids?: string[];
}

export interface UpdateBatchProductDto {
  batch_id: string;
  product_id: string;
  batch_number: string;
  quantity?: number;
  manufactured_date?: string;
  expiry_date: string;
  low_stock_threshold?: number;
  unit_product_price?: number;
  is_active?: boolean;
  product_type_ids?: string[];
  promotion_ids?: string[];
}

export interface BatchProductStats {
  totalBatches: number;
  activeBatches: number;
  expiringSoonBatches: number;
  lowStockBatches: number;
  totalQuantity: number;
  averageQuantity: number;
}

export interface BatchToggleStatusRequest {
  batch_ids: string[];
  is_active: boolean;
}

export interface BatchOperationResponse {
  success: boolean;
  message: string;
  updated_count: number;
  failed_batches?: string[];
}

export interface BatchProductFormData {
  product_id: string;
  batch_number: string;
  quantity: number;
  manufactured_date: string;
  expiry_date: string;
  low_stock_threshold: number;
  unit_product_price: number;
  is_active: boolean;
  product_type_id: string;
  promotion_ids: string[];
}
