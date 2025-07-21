import { IsOptional, IsString, IsNumber, IsBoolean, IsDateString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryTreatmentPlanDto {
  @IsOptional()
  @IsUUID()
  consultation_id?: string;

  @IsOptional()
  @IsUUID()
  product_id?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  day_number?: number;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsDateString()
  from_date?: string;

  @IsOptional()
  @IsDateString()
  to_date?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  include_deleted?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
