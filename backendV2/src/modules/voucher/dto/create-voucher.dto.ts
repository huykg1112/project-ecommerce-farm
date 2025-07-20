import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty({ message: 'Voucher code is required' })
  voucher_code: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Minimum order value must be greater than or equal to 0' })
  min_order_value?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, {
    message: 'Maximum discount value must be greater than or equal to 0',
  })
  max_discount_value?: number;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Usage limit must be at least 1' })
  usage_limit?: number;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsOptional()
  distributor_id: string;
}
