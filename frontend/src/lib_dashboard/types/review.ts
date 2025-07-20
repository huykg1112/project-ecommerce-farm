import type { Product } from "./product";
import { User } from "./user";

export interface ReviewResponse {
  review_id: string;
  product: Product;
  user: User;
  distributor?: User;
  parent_review?: ReviewResponse;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
