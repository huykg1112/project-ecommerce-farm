import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBatchProductDto {
  @IsUUID()
  @IsOptional()
  product_id?: string;

  @IsUUID()
  @IsOptional()
  invenstory_id?: string;

  @IsString()
  @MaxLength(50)
  batch_number: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsDateString()
  @IsOptional()
  manufactured_date?: string;

  @IsDateString()
  expiry_date: string;

  @IsInt()
  @IsOptional()
  low_stock_threshold?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
