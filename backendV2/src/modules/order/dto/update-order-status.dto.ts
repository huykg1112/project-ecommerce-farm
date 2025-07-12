import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateOrderStatusDto {
  @IsUUID()
  status_id: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  estimated_delivery_date?: string;
}
