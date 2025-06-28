import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientDisease } from '../ingredient-disease/entities/ingredient-disease.entity';
import { ActiveIngredientController } from './active-ingredient.controller';
import { ActiveIngredientService } from './active-ingredient.service';
import { ActiveIngredient } from './entities/active-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActiveIngredient, IngredientDisease])],
  controllers: [ActiveIngredientController],
  providers: [ActiveIngredientService],
})
export class ActiveIngredientModule {}
