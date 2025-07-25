import { Product } from "@/lib_dashboard/types/product";
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
  product?: Product; // Sản phẩm được đánh giá
  user?: User; // Người dùng đã đánh giá (đánh giá 1 lần duy nhất) nếu là đánh giá của đại lý thì ko có này
  distributor?: User; // Distributor đã phản hồi đánh giá trong parent_review (phản hồi của đánh giá 1 lần duy nhất) nếu là đánh giá của khách hàng thì ko có này
  parent_review?: Review; // review gốc nếu đây là review phản hồi
  distributor_response_review?: Review; //  đây là phản hồi của distributor nếu có
}
