import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class FilterOrderDetailDto {
  @IsUUID()
  @IsOptional()
  order_id?: string;

  @IsUUID()
  @IsOptional()
  batch_id?: string;

  @IsInt()
  @IsOptional()
  min_quantity?: number;

  @IsInt()
  @IsOptional()
  max_quantity?: number;
}
