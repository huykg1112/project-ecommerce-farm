import { Injectable } from '@nestjs/common';
import { CreateFavoriteProductDto } from './dto/create-favorite_product.dto';
import { UpdateFavoriteProductDto } from './dto/update-favorite_product.dto';

@Injectable()
export class FavoriteProductsService {
  create(createFavoriteProductDto: CreateFavoriteProductDto) {
    return 'This action adds a new favoriteProduct';
  }

  findAll() {
    return `This action returns all favoriteProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favoriteProduct`;
  }

  update(id: number, updateFavoriteProductDto: UpdateFavoriteProductDto) {
    return `This action updates a #${id} favoriteProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} favoriteProduct`;
  }
}
