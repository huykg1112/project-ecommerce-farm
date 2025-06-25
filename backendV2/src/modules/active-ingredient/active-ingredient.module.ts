import { Module } from '@nestjs/common';
import { ActiveIngredientService } from './active-ingredient.service';
import { ActiveIngredientController } from './active-ingredient.controller';

@Module({
  controllers: [ActiveIngredientController],
  providers: [ActiveIngredientService],
})
export class ActiveIngredientModule {}
