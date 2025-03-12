import { Product } from "./products";

export interface FavoriteProduct {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: any;
  product?: Product[];
}
