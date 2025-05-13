import { IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  effects: string;

  @IsString()
  warnings: string;

  @IsOptional()
  @IsString()
  chemicalFormula?: string;

  @IsOptional()
  @IsString()
  toxicityLevel?: string;

  @IsOptional()
  @IsString()
  usageInstructions?: string;
} 