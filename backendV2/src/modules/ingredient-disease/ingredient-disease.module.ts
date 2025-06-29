import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveIngredient } from '../active-ingredient/entities/active-ingredient.entity';
import { Disease } from '../disease/entities/disease.entity';
import { IngredientDisease } from './entities/ingredient-disease.entity';
import { IngredientDiseaseController } from './ingredient-disease.controller';
import { IngredientDiseaseService } from './ingredient-disease.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientDisease, ActiveIngredient, Disease]),
  ],
  controllers: [IngredientDiseaseController],
  providers: [IngredientDiseaseService],
})
export class IngredientDiseaseModule {}
