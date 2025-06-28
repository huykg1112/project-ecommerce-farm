import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDiseaseDto {
  @IsString()
  @MaxLength(100)
  disease_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
