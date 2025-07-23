import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
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

  @IsOptional()
  disease_name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTreatmentPlanDto)
  treatment_plans?: CreateTreatmentPlanDto[];
}
