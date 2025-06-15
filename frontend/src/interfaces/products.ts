import { Category } from "./categories";
import { Ingredient } from "./ingredients";

export interface Product {
  id: string;
  name: string;
  description?: string;
  discountPrice?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
  stock?: number;
  averageRating?: number;
  totalSales?: number;
  isFeatured?: boolean;
  usageInstructions?: string;
  safetyInstructions?: string;
  storageInstructions?: string;
  ingredients?: Ingredient[];
  images?: ProductImage[];
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
