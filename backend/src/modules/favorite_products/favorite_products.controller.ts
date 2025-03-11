import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoriteProductsService } from './favorite_products.service';
import { CreateFavoriteProductDto } from './dto/create-favorite_product.dto';
import { UpdateFavoriteProductDto } from './dto/update-favorite_product.dto';

@Controller('favorite-products')
export class FavoriteProductsController {
  constructor(private readonly favoriteProductsService: FavoriteProductsService) {}

  @Post()
  create(@Body() createFavoriteProductDto: CreateFavoriteProductDto) {
    return this.favoriteProductsService.create(createFavoriteProductDto);
  }

  @Get()
  findAll() {
    return this.favoriteProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoriteProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoriteProductDto: UpdateFavoriteProductDto) {
    return this.favoriteProductsService.update(+id, updateFavoriteProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoriteProductsService.remove(+id);
  }
}
