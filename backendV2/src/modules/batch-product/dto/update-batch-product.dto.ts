import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateBatchProductDto {
  @IsString()
  product_id: string;

  @IsOptional()
  @IsString()
  product_type_id?: string;

  @IsOptional()
  promotion_ids?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(50)
  batch_number: string;

  @IsInt()
  @Min(0)
  quantity?: number;

  @IsDateString()
  @IsOptional()
  manufactured_date?: string;

  @IsDateString()
  expiry_date: string;

  @IsInt()
  @IsOptional()
  low_stock_threshold?: number;

  @IsOptional()
  @Min(0) // Đảm bảo giá trị >= 0
  unit_product_price?: number; // Sửa kiểu dữ liệu thành number

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
