import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class FilterOrderDto {
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsUUID()
  @IsOptional()
  distributor_id?: string;

  @IsUUID()
  @IsOptional()
  status_id?: string;

  @IsUUID()
  @IsOptional()
  payment_method_id?: string;

  @IsNumber()
  @IsOptional()
  min_total_amount?: number;

  @IsNumber()
  @IsOptional()
  max_total_amount?: number;

  @IsDateString()
  @IsOptional()
  from_date?: string;

  @IsDateString()
  @IsOptional()
  to_date?: string;

  @IsString()
  @IsOptional()
  keyword?: string; // tìm kiếm theo tên user, distributor, ...
}
