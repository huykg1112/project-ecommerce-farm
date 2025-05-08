import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '@root/src/auth/decorators/roles.decorator';
import { Role } from '@root/src/auth/enums/role.enum';
import { JwtAuthGuard } from '@root/src/auth/jwt-auth.guard';
import { RolesGuard } from '@root/src/auth/roles.guard';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { SearchIngredientDto } from './dto/search-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchIngredientDto) {
    return this.ingredientsService.findAll(searchDto);
  }

  @Get('search/name/:name')
  findByName(@Param('name') name: string) {
    return this.ingredientsService.findByName(name);
  }

  @Get('search/toxicity/:level')
  findByToxicityLevel(@Param('level') level: string) {
    return this.ingredientsService.findByToxicityLevel(level);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(id);
  }
} 