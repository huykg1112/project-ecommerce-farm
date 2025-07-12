import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailDto } from '../../order-detail/dto/create-order-detail.dto';

export class CreateOrderDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  distributor_id: string;

  @IsUUID()
  status_id: string;

  @IsUUID()
  payment_method_id: string;

  @IsUUID()
  batch_id: string;

  @IsNumber()
  total_amount: number;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  notes?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  shipping_address?: string;

  @IsDateString()
  @IsOptional()
  estimated_delivery_date?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  order_details: CreateOrderDetailDto[];
}
