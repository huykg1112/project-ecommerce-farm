import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOrderDetailDto {
  @IsUUID()
  @IsOptional()
  order_id?: string;

  @IsUUID()
  batch_id: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unit_price: number;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}
