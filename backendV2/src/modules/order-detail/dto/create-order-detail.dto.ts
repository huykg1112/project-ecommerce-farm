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
  batch_id: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unit_price: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}
