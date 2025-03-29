import { Category } from "./categories";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  productImages?: ProductImage[];
  batches?: ProductBatch[];
  categories?: Category[];
}

export interface ProductImage {
  id: string;
  url: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  product?: Product;
}

export interface ProductBatch {
  id: string;
  batchCode: string;
  quantity: number;
  productionDate: Date;
  expiryDate: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  product?: Product;
}
