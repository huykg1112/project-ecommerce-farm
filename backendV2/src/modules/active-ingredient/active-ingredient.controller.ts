import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActiveIngredientService } from './active-ingredient.service';
import { CreateActiveIngredientDto } from './dto/create-active-ingredient.dto';
import { UpdateActiveIngredientDto } from './dto/update-active-ingredient.dto';

@Controller('active-ingredient')
export class ActiveIngredientController {
  constructor(
    private readonly activeIngredientService: ActiveIngredientService,
  ) {}

  @Post()
  create(@Body() createActiveIngredientDto: CreateActiveIngredientDto) {
    return this.activeIngredientService.create(createActiveIngredientDto);
  }

  @Get()
  findAll() {
    return this.activeIngredientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activeIngredientService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActiveIngredientDto: UpdateActiveIngredientDto,
  ) {
    return this.activeIngredientService.update(id, updateActiveIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activeIngredientService.remove(id);
  }

  // GET /active-ingredient/:id/products
  @Get(':id/products')
  getProducts(@Param('id') id: string) {
    return this.activeIngredientService.getProductsForIngredient(id);
  }
}
