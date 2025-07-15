import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AdvancedProductFilterDto {
  @IsOptional()
  @IsString()
  search?: string; // Đổi từ 'keyword' thành 'search'

  @IsOptional()
  @IsString()
  category_id?: string; // Single selection

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category_ids?: string[]; // Multi selection cho advanced search

  @IsOptional()
  @IsString()
  manufacturer_id?: string;

  @IsOptional()
  @IsString()
  invenstory_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  in_ids?: string[]; // Multi selection cho advanced search

  @IsOptional()
  @IsEnum(['active', 'inactive', 'all'])
  status?: 'active' | 'inactive' | 'all';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_max?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating_max?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredient_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disease_ids?: string[];

  @IsOptional()
  @IsEnum(['name', 'price', 'created_at', 'rating'])
  sort_by?: 'name' | 'price' | 'created_at' | 'rating';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort_order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
