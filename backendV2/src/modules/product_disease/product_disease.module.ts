import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDisease } from './entities/product_disease.entity';
import { ProductDiseaseController } from './product_disease.controller';
import { ProductDiseaseService } from './product_disease.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDisease])],
  controllers: [ProductDiseaseController],
  providers: [ProductDiseaseService],
  exports: [TypeOrmModule], // Optional, if you need to use the repo elsewhere
})
export class ProductDiseaseModule {}
