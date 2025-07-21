import { IsOptional, IsString, IsUUID } from 'class-validator';

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

  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsOptional()
  disease_name?: string;
}
