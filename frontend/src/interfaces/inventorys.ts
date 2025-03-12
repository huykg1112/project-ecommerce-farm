import { ProductBatch } from "./products";

export interface Inventory {
  id: string;
  quantityInStock: number;
  location?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  productBatches?: ProductBatch[];
}
