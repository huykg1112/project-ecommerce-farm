import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from '../disease/entities/disease.entity';
import { TreatmentPlan } from '../treatment-plan/entities/treatment-plan.entity';
import { User } from '../user/entities/user.entity';
import { AiConsultationController } from './ai-consultation.controller';
import { AiConsultationService } from './ai-consultation.service';
import { AiConsultation } from './entities/ai-consultation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiConsultation, Disease, User, TreatmentPlan]),
  ],
  controllers: [AiConsultationController],
  providers: [AiConsultationService],
  exports: [AiConsultationService],
})
export class AiConsultationModule {}
