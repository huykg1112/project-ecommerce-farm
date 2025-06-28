import { PartialType } from '@nestjs/mapped-types';
import { CreateProductIngredientDto } from './create-product-ingredient.dto';

export class UpdateProductIngredientDto extends PartialType(
  CreateProductIngredientDto,
) {}
