export class ProductResponseDto {
  product_id: string;
  product_name: string;
  description?: string;
  usage_instructions?: string;
  unit_product_price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  categories: ProductCategoryDto[];
  manufacturer?: ProductManufacturerDto;
  distributor?: ProductDistributorDto;
  images: ProductImageDto[];
  reviews: ProductReviewDto[];
  avg_rating: number | null;
  product_ingredients: ProductIngredientDto[];
  diseases: ProductDiseaseDto[];
}

export class ProductCategoryDto {
  category_id: string;
  category_name: string;
}

export class ProductManufacturerDto {
  id: string;
  name: string;
  logo?: string;
}

export class ProductDistributorDto {
  user_id: string;
  full_name: string;
  invenstory_id?: string;
}

export class ProductImageDto {
  image_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: Date;
}

export class ProductReviewDto {
  review_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
}

export class ProductIngredientDto {
  ingredient_id: string;
  ingredient_name: string;
  is_primary: boolean;
}

export class ProductDiseaseDto {
  disease_id: string;
  disease_name: string;
  is_primary: boolean;
}

export class ProductStatsResponseDto {
  total_products: number;
  active_products: number;
  inactive_products: number;
  avg_price: number;
}

export class BatchOperationResponseDto {
  message: string;
  affected_count: number;
  success_ids: string[];
  failed_ids?: string[];
}
