import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { RolesGuard } from '../../auth/roles.guard';
import { Public } from '../../public.decorator';
import { AdvancedProductFilterDto } from './dto/advanced-product-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@UseGuards(RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productService.create(createProductDto, req.user);
  }

  @Public()
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Public()
  @Get('distributor/:user_id')
  findByDistributor(@Param('user_id') user_id: string) {
    return this.productService.findByDistributor(user_id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productService.update(id, updateProductDto, req.user);
  }

  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.productService.remove(id, req.user);
  }

  // GET /product/:id/ingredients
  @Get(':id/ingredients')
  getIngredients(@Param('id') id: string) {
    return this.productService.getIngredientsForProduct(id);
  }

  @Public()
  @Post('advanced-search')
  async advancedSearch(@Body() filter: AdvancedProductFilterDto) {
    const products = await this.productService.advancedSearchProducts(filter);
    // TODO: Serialize output
    return products;
  }

  // GET /product/:id/diseases
  @Get(':id/diseases')
  getDiseases(@Param('id') id: string) {
    return this.productService.getDiseasesForProduct(id);
  }
}
