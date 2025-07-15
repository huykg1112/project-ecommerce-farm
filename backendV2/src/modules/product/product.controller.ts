import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { RolesGuard } from '../../auth/roles.guard';
import { Public } from '../../public.decorator';
import { AdvancedProductFilterDto } from './dto/advanced-product-filter.dto';
import {
  BatchDeleteDto,
  BatchToggleStatusDto,
} from './dto/batch-operation.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductStatsDto } from './dto/product-stats.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@UseGuards(RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // === EXISTING ENDPOINTS ===

  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productService.create(createProductDto, req.user);
  }

  @Public()
  @Get()
  findAll(@Query() filters: ProductFilterDto) {
    return this.productService.findAll();
  }

  @Public()
  @Get('for-users')
  findAllForUser(@Query() filters: ProductFilterDto) {
    return this.productService.findAllForUser();
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

  @Public()
  @Get(':id/for-user')
  findOneForUser(@Param('id') id: string) {
    return this.productService.findOneForUser(id);
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

  // === INGREDIENT & DISEASE ENDPOINTS ===

  @Public()
  @Get(':id/ingredients')
  getIngredients(@Param('id') id: string) {
    return this.productService.getIngredientsForProduct(id);
  }

  @Public()
  @Get(':id/diseases')
  getDiseases(@Param('id') id: string) {
    return this.productService.getDiseasesForProduct(id);
  }

  // === SEARCH ENDPOINTS ===

  @Public()
  @Post('advanced-search')
  async advancedSearch(@Body() filter: AdvancedProductFilterDto) {
    const products = await this.productService.advancedSearchProducts(filter);
    return {
      success: true,
      data: products,
      total: products.length,
    };
  }

  // === NEW ENDPOINTS ===

  // Toggle single product status
  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string, @Req() req) {
    return this.productService.toggleStatus(id, req.user);
  }

  // Batch operations
  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch('batch/toggle-status')
  batchToggleStatus(@Body() batchDto: BatchToggleStatusDto, @Req() req) {
    return this.productService.batchSetStatus(
      batchDto.product_ids,
      batchDto.is_active,
      req.user,
    );
  }

  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch('batch/activate')
  batchActivate(@Body() batchDto: BatchDeleteDto, @Req() req) {
    return this.productService.batchSetStatus(
      batchDto.product_ids,
      true,
      req.user,
    );
  }

  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch('batch/deactivate')
  batchDeactivate(@Body() batchDto: BatchDeleteDto, @Req() req) {
    return this.productService.batchSetStatus(
      batchDto.product_ids,
      false,
      req.user,
    );
  }

  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Delete('batch')
  batchDelete(@Body() batchDto: BatchDeleteDto, @Req() req) {
    return this.productService.batchDelete(batchDto.product_ids, req.user);
  }

  // Statistics
  @Get('stats')
  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  getProductStats(@Query() statsDto: ProductStatsDto, @Req() req) {
    // If user is distributor, only show their stats
    const distributorId =
      req.user.role?.role_name === Role.DISTRIBUTOR
        ? req.user.user_id
        : statsDto.distributor_id;

    return this.productService.getProductStats(distributorId);
  }

  @Public()
  @Get('stats/public')
  getPublicProductStats() {
    return this.productService.getProductStats();
  }

  // Additional utility endpoints
  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Get('my-products')
  getMyProducts(@Req() req) {
    return this.productService.findByDistributor(req.user.user_id);
  }

  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Get('my-products/stats')
  getMyProductStats(@Req() req) {
    return this.productService.getProductStats(req.user.user_id);
  }

  @Public()
  @Get()
  findAllWithPagination(@Query() filters: ProductFilterDto) {
    return this.productService.findAllWithPagination(filters);
  }
}
