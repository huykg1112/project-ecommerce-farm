import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import { CreateFavoriteProductDto } from './dto/create-favorite_product.dto';
import { UpdateFavoriteProductDto } from './dto/update-favorite_product.dto';
import { FavoriteProductsService } from './favorite_products.service';

@Controller('favorite-products')
export class FavoriteProductsController {
  constructor(private readonly favoriteProductsService: FavoriteProductsService) {}

  @Post()
  create(@Body() createFavoriteProductDto: CreateFavoriteProductDto, @Request() req) {
    createFavoriteProductDto.user = req.user;
    return this.favoriteProductsService.create(createFavoriteProductDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.favoriteProductsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoriteProductsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFavoriteProductDto: UpdateFavoriteProductDto,
  ) {
    return this.favoriteProductsService.update(id, updateFavoriteProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoriteProductsService.remove(id);
  }
}
