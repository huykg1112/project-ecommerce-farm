import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
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

  @IsNumber()
  total_amount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  order_details: CreateOrderDetailDto[];
}
