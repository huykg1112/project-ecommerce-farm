import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
// import { Roles } from '@root/src/auth/decorators/roles.decorator';
// import { Role } from '@root/src/auth/enums/role.enum';
// import { RolesGuard } from '@root/src/auth/roles.guard';
import { Public } from '@root/src/public.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll(@Query() searchDto: SearchProductDto) {
    return this.productsService.findAll(searchDto);
  }
  @Public()
  @Get('recommendations')
  getRecommendations(@Query('userId') userId: string) {
    return this.productsService.getRecommendations(userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  // @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  // @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
