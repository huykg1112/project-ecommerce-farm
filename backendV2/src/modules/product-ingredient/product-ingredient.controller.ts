import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductIngredientService } from './product-ingredient.service';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dto/update-product-ingredient.dto';

@Controller('product-ingredient')
export class ProductIngredientController {
  constructor(private readonly productIngredientService: ProductIngredientService) {}

  @Post()
  create(@Body() createProductIngredientDto: CreateProductIngredientDto) {
    return this.productIngredientService.create(createProductIngredientDto);
  }

  @Get()
  findAll() {
    return this.productIngredientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productIngredientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductIngredientDto: UpdateProductIngredientDto) {
    return this.productIngredientService.update(+id, updateProductIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productIngredientService.remove(+id);
  }
}
