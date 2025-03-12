import { Product } from "./products";
import { User } from "./users";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewDate: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  product?: Product;
  user?: User;
}
