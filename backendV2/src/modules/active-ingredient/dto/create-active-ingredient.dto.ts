import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateActiveIngredientDto {
  @IsString()
  @MaxLength(100)
  ingredient_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  hazard_level?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
