import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveIngredient } from '../active-ingredient/entities/active-ingredient.entity';
import { Product } from '../product/entities/product.entity';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { ProductIngredientController } from './product-ingredient.controller';
import { ProductIngredientService } from './product-ingredient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductIngredient, Product, ActiveIngredient]),
  ],
  controllers: [ProductIngredientController],
  providers: [ProductIngredientService],
})
export class ProductIngredientModule {}
