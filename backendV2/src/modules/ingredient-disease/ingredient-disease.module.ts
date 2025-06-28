import { Module } from '@nestjs/common';
import { IngredientDiseaseService } from './ingredient-disease.service';
import { IngredientDiseaseController } from './ingredient-disease.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientDisease } from './entities/ingredient-disease.entity';
import { ActiveIngredient } from '../active-ingredient/entities/active-ingredient.entity';
import { Disease } from '../disease/entities/disease.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientDisease, ActiveIngredient, Disease]),
  ],
  controllers: [IngredientDiseaseController],
  providers: [IngredientDiseaseService],
})
export class IngredientDiseaseModule {}
