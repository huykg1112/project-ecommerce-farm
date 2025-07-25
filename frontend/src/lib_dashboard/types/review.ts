import type { Product } from "./product";
import { User } from "./user";

export interface ReviewResponse {
  review_id: string;
  product: Product;
  user?: User;
  distributor?: User;
  parent_review?: ReviewResponse;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface CreateReviewDto {
  product_id: string;
  user_id?: string; // If not provided, use current user
  distributor_id?: string; // If not provided, use current user
  parent_review_id?: string; // For responses to existing reviews
  rating: number;
  comment?: string;
}

export interface CreateReviewResponseDto {
  parent_review_id: string; // ID of the review being responded to
  distributor_id?: string; // If not provided, use current user
  comment: string; // Response comment
}
