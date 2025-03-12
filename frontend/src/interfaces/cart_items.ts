import { Product } from "./products";

export interface CartItem {
  id: string;
  quantity: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  product?: Product[];
}
