import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDiseaseDto } from './create-ingredient-disease.dto';

export class UpdateIngredientDiseaseDto extends PartialType(CreateIngredientDiseaseDto) {}
