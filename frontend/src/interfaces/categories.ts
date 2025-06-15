import { Product } from "./products";

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  image?: string;
  imagePublicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  products?: Product[];
}
