import { Injectable } from '@nestjs/common';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dto/update-product-ingredient.dto';

@Injectable()
export class ProductIngredientService {
  create(createProductIngredientDto: CreateProductIngredientDto) {
    return 'This action adds a new productIngredient';
  }

  findAll() {
    return `This action returns all productIngredient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productIngredient`;
  }

  update(id: number, updateProductIngredientDto: UpdateProductIngredientDto) {
    return `This action updates a #${id} productIngredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} productIngredient`;
  }
}
