import { Module } from '@nestjs/common';
import { DiseaseService } from './disease.service';
import { DiseaseController } from './disease.controller';

@Module({
  controllers: [DiseaseController],
  providers: [DiseaseService],
})
export class DiseaseModule {}
