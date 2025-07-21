import { IsString, IsOptional, IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateTreatmentPlanDto {
  @IsUUID()
  @IsOptional()
  consultation_id?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  day_number?: number;

  @IsString()
  treatment_instruction: string;

  @IsString()
  @IsOptional()
  dosage_instruction?: string;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsUUID()
  @IsOptional()
  product_id?: string;
}
