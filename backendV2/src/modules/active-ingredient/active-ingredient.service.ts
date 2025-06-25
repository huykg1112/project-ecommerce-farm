import { Injectable } from '@nestjs/common';
import { CreateActiveIngredientDto } from './dto/create-active-ingredient.dto';
import { UpdateActiveIngredientDto } from './dto/update-active-ingredient.dto';

@Injectable()
export class ActiveIngredientService {
  create(createActiveIngredientDto: CreateActiveIngredientDto) {
    return 'This action adds a new activeIngredient';
  }

  findAll() {
    return `This action returns all activeIngredient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activeIngredient`;
  }

  update(id: number, updateActiveIngredientDto: UpdateActiveIngredientDto) {
    return `This action updates a #${id} activeIngredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} activeIngredient`;
  }
}
