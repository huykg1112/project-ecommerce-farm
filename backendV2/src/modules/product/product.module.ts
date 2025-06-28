import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductIngredient])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
