import { Product } from "./product";

export interface Category {
  id: string; // Backend dùng 'id' thay vì 'category_id'
  name: string; // Backend dùng 'name' thay vì 'category_name'
  description: string;
  image?: string; // Backend dùng 'image' thay vì 'category_img'
  imagePublicId?: string; // Backend có thêm field này
  isActive: boolean; // Backend dùng 'isActive' thay vì 'is_active'
  isDeleted: boolean;
  createdAt: Date; // Backend dùng 'createdAt' thay vì 'created_at'
  updatedAt: Date; // Backend dùng 'updatedAt' thay vì 'updated_at'
  products: Product[];
}

export interface CreateCategoryRequest {
  name: string; // Vẫn giữ để mapping
  description: string;
  isActive: boolean; // Vẫn giữ để mapping
  image?: string; // Vẫn giữ để mapping
}

export interface UpdateCategoryRequest {
  name: string; // Vẫn giữ để mapping
  description: string;
  isActive: boolean; // Vẫn giữ để mapping
  image?: string; // Vẫn giữ để mapping
}

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  hazardLevel?: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
