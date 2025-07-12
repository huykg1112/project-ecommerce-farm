import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/entities/category.entity';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { ProductDisease } from '../product_disease/entities/product_disease.entity';
import { User } from '../user/entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Manufacturer } from '../manufacturer/entities/manufacturer.entity';
import { Review } from '../review/entities/review.entity';

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
    ]),
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule],
})
export class ProductModule {}
