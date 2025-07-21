import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentPlanService } from './treatment-plan.service';
import { TreatmentPlanController } from './treatment-plan.controller';
import { TreatmentPlan } from './entities/treatment-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TreatmentPlan])],
  controllers: [TreatmentPlanController],
  providers: [TreatmentPlanService],
  exports: [TreatmentPlanService],
})
export class TreatmentPlanModule {}
