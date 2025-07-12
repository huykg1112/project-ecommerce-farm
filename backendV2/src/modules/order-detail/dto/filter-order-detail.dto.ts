import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class FilterOrderDetailDto {
  @IsUUID()
  @IsOptional()
  order_id?: string;

  @IsUUID()
  @IsOptional()
  batch_id?: string;

  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;

  @IsInt()
  @IsOptional()
  min_quantity?: number;

  @IsInt()
  @IsOptional()
  max_quantity?: number;

  @IsNumber()
  @IsOptional()
  min_unit_price?: number;

  @IsNumber()
  @IsOptional()
  max_unit_price?: number;

  @IsDateString()
  @IsOptional()
  from_date?: string;

  @IsDateString()
  @IsOptional()
  to_date?: string;
}
