import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateTreatmentPlanDto } from '../../treatment-plan/dto/create-treatment-plan.dto';

export class CreateAiConsultationDto {
  @IsString()
  @IsOptional()
  crop_type?: string;

  @IsString()
  @IsOptional()
  symptom_description?: string;

  @IsString()
  @IsOptional()
  growth_stage?: string;

  @IsString()
  @IsOptional()
  recommended_treatment?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  treatment_duration?: number;

  @IsString()
  @IsOptional()
  severity_level?: string;

  @IsString()
  @IsOptional()
  recommended_name_products?: string;

  @IsString()
  @IsOptional()
  prevention_tips?: string;

  @IsString()
  @IsOptional()
  monitoring_signs?: string;

  @IsOptional()
  disease_name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTreatmentPlanDto)
  treatment_plans?: CreateTreatmentPlanDto[];
}
