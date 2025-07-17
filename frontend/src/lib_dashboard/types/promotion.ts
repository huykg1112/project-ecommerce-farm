import { User } from "@/types/entities";

export interface Promotion {
  promotion_id: string;
  created_by?: User;
  promotion_name: string;
  description?: string;
  discount_value?: number;
  start_date?: Date;
  end_date?: Date;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;
  // batch_products: BatchProduct[];
}

export interface CreatePromotionResponse {
  promotion_name: string | null;
  description?: string | null;
  discount_value: number | null;
  start_date: Date | null;
  end_date: Date | null;
  is_active: boolean | null;
  batch_product_ids: string[];
}

export interface UpdatePromotionRequest {
  promotion_name?: string | null;
  description?: string | null;
  discount_value?: number | null;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active?: boolean | null;
  batch_product_ids?: string[] | [];
}
