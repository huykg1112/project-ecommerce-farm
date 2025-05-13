import { Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

export class ComboProductDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateProductsComboDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComboProductDto)
  products!: ComboProductDto[];

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;
} 