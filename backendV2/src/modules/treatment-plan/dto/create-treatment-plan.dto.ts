import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateTreatmentPlanDto {
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
}
