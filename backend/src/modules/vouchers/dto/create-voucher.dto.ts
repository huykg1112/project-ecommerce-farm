import { Type } from 'class-transformer';
import {
      IsDate,
      IsEnum,
      IsNotEmpty,
      IsNumber,
      IsOptional,
      IsString,
      IsUUID,
      Max,
      Min,
} from 'class-validator';
import { DiscountType, VoucherType } from '../entities/voucher.entity';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(VoucherType)
  @IsNotEmpty()
  type!: VoucherType;

  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType!: DiscountType;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountValue!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderValue?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscountAmount?: number;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @IsUUID()
  @IsOptional()
  distributorId?: string; // ID của đại lý (chỉ cần khi type là NORMAL)
}
