import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchProduct } from '../batch-product/entities/batch-product.entity';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/entities/category.entity';
import { Manufacturer } from '../manufacturer/entities/manufacturer.entity';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { ProductDisease } from '../product_disease/entities/product_disease.entity';
import { Review } from '../review/entities/review.entity';
import { User } from '../user/entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductImage } from '../product_image/entities/product_image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductIngredient,
      ProductDisease,
      Category,
      User,
      Manufacturer,
      Review,
      BatchProduct,
      ProductImage,
    ]),
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
