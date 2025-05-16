import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  discountStartDate?: Date | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  discountEndDate?: Date | null;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @IsOptional()
  @IsString()
  safetyInstructions?: string;

  @IsOptional()
  @IsString()
  storageInstructions?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsUUID('4', { each: true })
  ingredientIds?: string[];
}
