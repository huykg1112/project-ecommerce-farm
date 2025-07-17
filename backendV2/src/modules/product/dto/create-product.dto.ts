import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  product_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  usage_instructions?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  category_ids: string[];

  @IsNumber()
  @Min(0)
  unit_product_price: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // danh mục sản phẩm

  @IsOptional()
  @IsUUID()
  manufacturer_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  ingredient_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  disease_ids?: string[];
}
