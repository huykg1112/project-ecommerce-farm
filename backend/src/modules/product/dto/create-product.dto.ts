import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

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

  @IsNotEmpty()
  @IsInt()
  stock: number;

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

  @IsNotEmpty()
  @IsUUID()
  distributorId: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsUUID('4', { each: true })
  ingredientIds?: string[];
}
