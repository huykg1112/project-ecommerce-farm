import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatmentPlanDto } from './create-treatment-plan.dto';

export class UpdateTreatmentPlanDto extends PartialType(CreateTreatmentPlanDto) {}
