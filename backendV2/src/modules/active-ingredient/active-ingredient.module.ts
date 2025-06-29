import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientDisease } from '../ingredient-disease/entities/ingredient-disease.entity';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { ProductIngredientModule } from '../product-ingredient/product-ingredient.module';
import { Product } from '../product/entities/product.entity';
import { ActiveIngredientController } from './active-ingredient.controller';
import { ActiveIngredientService } from './active-ingredient.service';
import { ActiveIngredient } from './entities/active-ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActiveIngredient,
      IngredientDisease,
      ProductIngredient,
      Product,
    ]),
    ProductIngredientModule,
  ],
  controllers: [ActiveIngredientController],
  providers: [ActiveIngredientService],
  exports: [TypeOrmModule],
})
export class ActiveIngredientModule {}
