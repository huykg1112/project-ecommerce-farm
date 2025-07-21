import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTreatmentPlanDto } from './create-treatment-plan.dto';

export class BulkCreateTreatmentPlanDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTreatmentPlanDto)
  treatment_plans: CreateTreatmentPlanDto[];
}
