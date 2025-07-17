import { IsArray, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class BatchUpdateOrderStatusDto {
  @IsArray()
  @IsUUID(4, { each: true })
  order_ids: string[];

  @IsUUID()
  status_id: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}

export class BatchConfirmOrdersDto {
  @IsArray()
  @IsUUID(4, { each: true })
  order_ids: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}

export class BatchCancelOrdersDto {
  @IsArray()
  @IsUUID(4, { each: true })
  order_ids: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}