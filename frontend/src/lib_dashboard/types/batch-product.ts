import type { Product } from "./product";

export interface BatchProduct {
  batch_id: string;
  product: Product;
  batch_number: string;
  quantity: number;
  manufactured_date: Date;
  expiry_date: Date;
  low_stock_threshold: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  invenstory?: {
    invenstory_id: string;
    warehouse_name: string;
  };
}

export interface BatchProductFilters {
  search?: string;
  product_id?: string;
  invenstory_id?: string;
  is_active?: boolean;
  expiring_soon_days?: number;
  low_stock?: boolean;
  batch_number?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface BatchProductPaginationResponse {
  data: BatchProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
}

export interface UpdateBatchProductDto {
  batch_id: string;
  product_id: string;
  batch_number: string;
  quantity?: number;
  manufactured_date?: string;
  expiry_date: string;
  low_stock_threshold?: number;
  is_active?: boolean;
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
  invenstory_id: string;
  batch_number: string;
  quantity: number;
  manufactured_date: string;
  expiry_date: string;
  low_stock_threshold: number;
  is_active: boolean;
}