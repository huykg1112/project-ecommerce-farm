import { Product } from "./products";
import { User } from "./users";

export interface Review {
  review_id: string;
  product_id: string;
  user_id?: string;
  distributor_id?: string;
  parent_review_id?: string;
  rating?: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;

  // Populated relations
  product?: Product;
  user?: User;
  distributor?: User;
  parent_review?: Review;
  distributor_response_review?: Review;

  // Computed fields
  has_response?: boolean;
  response_count?: number;
}
