import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateIngredientDiseaseDto } from './dto/create-ingredient-disease.dto';
import { UpdateIngredientDiseaseDto } from './dto/update-ingredient-disease.dto';
import { IngredientDiseaseService } from './ingredient-disease.service';

@Controller('ingredient-disease')
export class IngredientDiseaseController {
  constructor(
    private readonly ingredientDiseaseService: IngredientDiseaseService,
  ) {}

  @Post()
  create(@Body() createIngredientDiseaseDto: CreateIngredientDiseaseDto) {
    return this.ingredientDiseaseService.create(createIngredientDiseaseDto);
  }

  @Get()
  findAll() {
    return this.ingredientDiseaseService.findAll();
  }

  @Get('one')
  findOne(
    @Query('ingredient_id') ingredient_id: string,
    @Query('disease_id') disease_id: string,
  ) {
    return this.ingredientDiseaseService.findOne(ingredient_id, disease_id);
  }

  @Patch()
  update(
    @Query('ingredient_id') ingredient_id: string,
    @Query('disease_id') disease_id: string,
    @Body() updateDto: UpdateIngredientDiseaseDto,
  ) {
    return this.ingredientDiseaseService.update(
      ingredient_id,
      disease_id,
      updateDto,
    );
  }

  @Delete()
  remove(
    @Query('ingredient_id') ingredient_id: string,
    @Query('disease_id') disease_id: string,
  ) {
    return this.ingredientDiseaseService.remove(ingredient_id, disease_id);
  }

  @Get('disease/:disease_id')
  findByDisease(
    @Param('disease_id') disease_id: string,
    @Query('is_primary') is_primary?: string,
  ) {
    let isPrimaryBool: boolean | undefined = undefined;
    if (is_primary === 'true') isPrimaryBool = true;
    if (is_primary === 'false') isPrimaryBool = false;
    return this.ingredientDiseaseService.findByDisease(
      disease_id,
      isPrimaryBool,
    );
  }

  @Get('ingredient/:ingredient_id')
  findByIngredient(
    @Param('ingredient_id') ingredient_id: string,
    @Query('is_primary') is_primary?: string,
  ) {
    let isPrimaryBool: boolean | undefined = undefined;
    if (is_primary === 'true') isPrimaryBool = true;
    if (is_primary === 'false') isPrimaryBool = false;
    return this.ingredientDiseaseService.findByIngredient(
      ingredient_id,
      isPrimaryBool,
    );
  }
}
