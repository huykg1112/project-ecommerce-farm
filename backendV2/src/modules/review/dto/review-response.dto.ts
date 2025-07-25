export class ReviewResponseDto {
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
  product?: {
    product_id: string;
    product_name: string;
  };

  user?: {
    user_id: string;
    fullname: string;
    email: string;
    avatar?: string;
  };

  distributor?: {
    user_id: string;
    fullname: string;
  };

  parent_review?: ReviewResponseDto;
  distributor_response_review?: ReviewResponseDto;

  // Computed fields
  has_response?: boolean;
  response_count?: number;
}
