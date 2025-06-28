import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseaseController } from './disease.controller';
import { DiseaseService } from './disease.service';
import { Disease } from './entities/disease.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Disease])],
  controllers: [DiseaseController],
  providers: [DiseaseService],
})
export class DiseaseModule {}
