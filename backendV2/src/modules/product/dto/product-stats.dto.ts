import { IsOptional, IsUUID } from 'class-validator';

export class ProductStatsDto {
  @IsOptional()
  @IsUUID()
  distributor_id?: string;
}
