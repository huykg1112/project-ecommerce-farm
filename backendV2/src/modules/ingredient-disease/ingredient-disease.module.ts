import { Module } from '@nestjs/common';
import { IngredientDiseaseService } from './ingredient-disease.service';
import { IngredientDiseaseController } from './ingredient-disease.controller';

@Module({
  controllers: [IngredientDiseaseController],
  providers: [IngredientDiseaseService],
})
export class IngredientDiseaseModule {}
