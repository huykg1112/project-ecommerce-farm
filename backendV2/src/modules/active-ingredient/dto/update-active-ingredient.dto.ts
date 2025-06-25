import { PartialType } from '@nestjs/mapped-types';
import { CreateActiveIngredientDto } from './create-active-ingredient.dto';

export class UpdateActiveIngredientDto extends PartialType(CreateActiveIngredientDto) {}
