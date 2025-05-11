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

import { Public } from '@root/src/public.decorator';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { SearchIngredientDto } from './dto/search-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  // @Roles(Role.ADMIN)
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  @Public()
  findAll(@Query() searchDto: SearchIngredientDto) {
    return this.ingredientsService.findAll(searchDto);
  }

  @Get('search/name/:name')
  @Public()
  findByName(@Param('name') name: string) {
    return this.ingredientsService.findByName(name);
  }

  @Get('search/toxicity/:level')
  @Public()
  findByToxicityLevel(@Param('level') level: string) {
    return this.ingredientsService.findByToxicityLevel(level);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(id);
  }
}
