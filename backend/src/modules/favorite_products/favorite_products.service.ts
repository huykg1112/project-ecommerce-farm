import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteProductDto } from './dto/create-favorite_product.dto';
import { UpdateFavoriteProductDto } from './dto/update-favorite_product.dto';
import { FavoriteProduct } from './entities/favorite_product.entity';

@Injectable()
export class FavoriteProductsService {
  constructor(
    @InjectRepository(FavoriteProduct)
    private favoriteProductRepository: Repository<FavoriteProduct>,
  ) {}

  async create(createFavoriteProductDto: CreateFavoriteProductDto) {
    const favoriteProduct = this.favoriteProductRepository.create(createFavoriteProductDto);
    return await this.favoriteProductRepository.save(favoriteProduct);
  }

  async findAll(userId: string) {
    return await this.favoriteProductRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async findOne(id: string) {
    const favoriteProduct = await this.favoriteProductRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!favoriteProduct) {
      throw new NotFoundException(`Favorite product with ID ${id} not found`);
    }
    return favoriteProduct;
  }

  async update(id: string, updateFavoriteProductDto: UpdateFavoriteProductDto) {
    const favoriteProduct = await this.findOne(id);
    Object.assign(favoriteProduct, updateFavoriteProductDto);
    return await this.favoriteProductRepository.save(favoriteProduct);
  }

  async remove(id: string) {
    const favoriteProduct = await this.findOne(id);
    return await this.favoriteProductRepository.remove(favoriteProduct);
  }
}
