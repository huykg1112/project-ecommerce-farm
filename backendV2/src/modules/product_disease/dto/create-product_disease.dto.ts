import { IsBoolean, IsUUID } from 'class-validator';

export class CreateProductDiseaseDto {
  @IsUUID()
  product_id: string;

  @IsUUID()
  disease_id: string;

  @IsBoolean()
  is_primary: boolean;
}
