import { Injectable } from '@nestjs/common';
import { CreateIngredientDiseaseDto } from './dto/create-ingredient-disease.dto';
import { UpdateIngredientDiseaseDto } from './dto/update-ingredient-disease.dto';

@Injectable()
export class IngredientDiseaseService {
  create(createIngredientDiseaseDto: CreateIngredientDiseaseDto) {
    return 'This action adds a new ingredientDisease';
  }

  findAll() {
    return `This action returns all ingredientDisease`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredientDisease`;
  }

  update(id: number, updateIngredientDiseaseDto: UpdateIngredientDiseaseDto) {
    return `This action updates a #${id} ingredientDisease`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredientDisease`;
  }
}
