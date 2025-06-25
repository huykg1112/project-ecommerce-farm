import { Module } from '@nestjs/common';
import { AiConsultationService } from './ai-consultation.service';
import { AiConsultationController } from './ai-consultation.controller';

@Module({
  controllers: [AiConsultationController],
  providers: [AiConsultationService],
})
export class AiConsultationModule {}
