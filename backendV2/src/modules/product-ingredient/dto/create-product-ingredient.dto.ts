import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductIngredientDto {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsUUID()
  @IsNotEmpty()
  ingredient_id: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  concentration?: number;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
}
