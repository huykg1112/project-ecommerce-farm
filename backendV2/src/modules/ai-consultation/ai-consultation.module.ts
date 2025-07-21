import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from '../disease/entities/disease.entity';
import { AiConsultationController } from './ai-consultation.controller';
import { AiConsultationService } from './ai-consultation.service';
import { AiConsultation } from './entities/ai-consultation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiConsultation, Disease])],
  controllers: [AiConsultationController],
  providers: [AiConsultationService],
  exports: [AiConsultationService],
})
export class AiConsultationModule {}
