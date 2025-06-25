import { Module } from '@nestjs/common';
import { ProductIngredientService } from './product-ingredient.service';
import { ProductIngredientController } from './product-ingredient.controller';

@Module({
  controllers: [ProductIngredientController],
  providers: [ProductIngredientService],
})
export class ProductIngredientModule {}
