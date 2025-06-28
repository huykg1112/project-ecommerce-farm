import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
})
export class ProductTypeModule {}
