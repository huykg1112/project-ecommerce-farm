import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class AdvancedProductFilterDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min_avg_rating?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  distributor_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  category_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  product_type_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  ingredient_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  disease_ids?: string[];
}
