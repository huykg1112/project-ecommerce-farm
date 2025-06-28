import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIngredientDiseaseDto {
  @IsUUID()
  ingredient_id: string;

  @IsUUID()
  disease_id: string;

  @IsBoolean()
  is_primary: boolean; // true: đặc trị, false: hỗ trợ

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  effectiveness_description?: string;
}
