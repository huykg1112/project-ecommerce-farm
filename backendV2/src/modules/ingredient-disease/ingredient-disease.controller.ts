import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IngredientDiseaseService } from './ingredient-disease.service';
import { CreateIngredientDiseaseDto } from './dto/create-ingredient-disease.dto';
import { UpdateIngredientDiseaseDto } from './dto/update-ingredient-disease.dto';

@Controller('ingredient-disease')
export class IngredientDiseaseController {
  constructor(private readonly ingredientDiseaseService: IngredientDiseaseService) {}

  @Post()
  create(@Body() createIngredientDiseaseDto: CreateIngredientDiseaseDto) {
    return this.ingredientDiseaseService.create(createIngredientDiseaseDto);
  }

  @Get()
  findAll() {
    return this.ingredientDiseaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientDiseaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredientDiseaseDto: UpdateIngredientDiseaseDto) {
    return this.ingredientDiseaseService.update(+id, updateIngredientDiseaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientDiseaseService.remove(+id);
  }
}
