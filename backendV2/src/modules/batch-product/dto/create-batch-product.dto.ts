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
  product_type_id?: string;

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
