import { IsInt, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderDetailDto {
  @IsUUID()
  order_id: string;

  @IsUUID()
  batch_id: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  subtotal: number;
}
