import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dto/update-product-ingredient.dto';
import { ProductIngredientService } from './product-ingredient.service';

@Controller('product-ingredient')
export class ProductIngredientController {
  constructor(
    private readonly productIngredientService: ProductIngredientService,
  ) {}

  @Post()
  create(@Body() createProductIngredientDto: CreateProductIngredientDto) {
    return this.productIngredientService.create(createProductIngredientDto);
  }

  @Get()
  findAll() {
    return this.productIngredientService.findAll();
  }

  @Get(':product_id/:ingredient_id')
  findOne(
    @Param('product_id') product_id: string,
    @Param('ingredient_id') ingredient_id: string,
  ) {
    return this.productIngredientService.findOne(product_id, ingredient_id);
  }

  @Patch(':product_id/:ingredient_id')
  update(
    @Param('product_id') product_id: string,
    @Param('ingredient_id') ingredient_id: string,
    @Body() updateProductIngredientDto: UpdateProductIngredientDto,
  ) {
    return this.productIngredientService.update(
      product_id,
      ingredient_id,
      updateProductIngredientDto,
    );
  }

  @Delete(':product_id/:ingredient_id')
  remove(
    @Param('product_id') product_id: string,
    @Param('ingredient_id') ingredient_id: string,
  ) {
    return this.productIngredientService.remove(product_id, ingredient_id);
  }

  @Get('product/:product_id')
  findByProduct(@Param('product_id') product_id: string) {
    return this.productIngredientService.findByProduct(product_id);
  }

  @Get('ingredient/:ingredient_id')
  findByIngredient(@Param('ingredient_id') ingredient_id: string) {
    return this.productIngredientService.findByIngredient(ingredient_id);
  }
}
