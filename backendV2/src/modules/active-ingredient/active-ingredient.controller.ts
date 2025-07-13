import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { ActiveIngredientService } from './active-ingredient.service';
import { CreateActiveIngredientDto } from './dto/create-active-ingredient.dto';
import { UpdateActiveIngredientDto } from './dto/update-active-ingredient.dto';

@Controller('active-ingredient')
export class ActiveIngredientController {
  constructor(
    private readonly activeIngredientService: ActiveIngredientService,
  ) {}

  @Post()
  async create(@Body() createActiveIngredientDto: CreateActiveIngredientDto) {
    const existingIngredient = await this.activeIngredientService.findByName(
      createActiveIngredientDto.ingredient_name,
    );
    if (existingIngredient) {
      throw new Error('Active ingredient with this name already exists');
    }
    return this.activeIngredientService.create(createActiveIngredientDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.activeIngredientService.findAll();
  }

  @Public()
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
  @Patch(':id/update-status')
  async updateStatus(@Param('id') id: string) {
    console.log(`Updating status for ingredient with ID: ${id}`);
    return this.activeIngredientService.toggleStatus(id);
  }
  @Patch('batch-toggle-status')
  async batchToggleStatus(@Body('ingredientIds') ingredientIds: string[]) {
    return this.activeIngredientService.batchToggleStatus(ingredientIds, true);
  }
}
