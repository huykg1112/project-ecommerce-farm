import { Module } from '@nestjs/common';
import { TreatmentPlanService } from './treatment-plan.service';
import { TreatmentPlanController } from './treatment-plan.controller';

@Module({
  controllers: [TreatmentPlanController],
  providers: [TreatmentPlanService],
})
export class TreatmentPlanModule {}
