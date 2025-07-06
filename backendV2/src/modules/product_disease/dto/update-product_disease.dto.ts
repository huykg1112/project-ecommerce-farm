import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDiseaseDto } from './create-product_disease.dto';

export class UpdateProductDiseaseDto extends PartialType(
  CreateProductDiseaseDto,
) {}
