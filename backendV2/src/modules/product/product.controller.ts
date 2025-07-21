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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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

  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10)) // Cho phép tối đa 10 hình ảnh
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    return this.productService.create(createProductDto, files || [], req.user);
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
  @Get('recommendations')
  async getRecommendations(@Req() req) {
    if (!req.user) {
      return this.productService.getPopularProducts(10);
    }
    const userId = req.user.user_id;
    return this.productService.getRecommendationsForUser(userId);
  }

  /**
   * Lấy sản phẩm đề xuất dựa trên nội dung (content-based)
   */
  @Public()
  @Get('recommendations/content-based')
  async getContentBasedRecommendations(@Req() req) {
    if (!req.user) {
      return this.productService.getPopularProducts(10);
    }
    const userId = req.user.user_id;
    return this.productService.getContentBasedRecommendations(userId);
  }

  /**
   * Lấy sản phẩm phổ biến (fallback cho user mới)
   */
  @Public()
  @Get('popular')
  async getPopularProducts() {
    return this.productService.getPopularProducts(10);
  }

  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch('batch/toggle-status')
  batchToggleStatus(@Body() batchDto: BatchToggleStatusDto, @Req() req) {
    return this.productService.batchSetStatus(
      batchDto.product_ids,
      batchDto.is_active,
      req.user,
    );
  }

  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch('batch/activate')
  batchActivate(@Body() batchDto: BatchDeleteDto, @Req() req) {
    return this.productService.batchSetStatus(
      batchDto.product_ids,
      true,
      req.user,
    );
  }

  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch('batch/deactivate')
  batchDeactivate(@Body() batchDto: BatchDeleteDto, @Req() req) {
    return this.productService.batchSetStatus(
      batchDto.product_ids,
      false,
      req.user,
    );
  }

  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Delete('batch')
  batchDelete(@Body() batchDto: BatchDeleteDto, @Req() req) {
    return this.productService.batchDelete(batchDto.product_ids, req.user);
  }

  // Statistics
  @Get('stats')
  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
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
  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Get('my-products')
  getMyProducts(@Req() req) {
    // nếu role là Admin, trả về tất cả sản phẩm của nhà phân phối
    if (req.user.role?.role_name !== Role.DISTRIBUTOR) {
      return this.productService.findAll();
    }
    console.log('User:', req.user);
    return this.productService.findByDistributor(req.user.user_id);
  }

  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Get('my-products/stats')
  getMyProductStats(@Req() req) {
    return this.productService.getProductStats(req.user.user_id);
  }

  // @Public()
  // @Get()
  // findAllWithPagination(@Query() filters: ProductFilterDto) {
  //   return this.productService.findAllWithPagination(filters);
  // }

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

  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    return this.productService.update(
      updateProductDto.product_id || id,
      updateProductDto,
      files || [],
      req.user,
    );
  }

  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
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

  // Toggle single product status
  //  @Roles(Role.DISTRIBUTOR, Role.ADMIN)
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string, @Req() req) {
    return this.productService.toggleStatus(id, req.user);
  }

  // Batch operations

  // === IMAGE MANAGEMENT ENDPOINTS ===

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  addImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    return this.productService.addImagesToProduct(id, files, req.user);
  }

  @Delete(':id/images')
  removeImages(
    @Param('id') id: string,
    @Body() body: { image_ids: string[] },
    @Req() req,
  ) {
    return this.productService.removeImagesFromProduct(
      id,
      body.image_ids,
      req.user,
    );
  }

  // === RECOMMENDATION SYSTEM ===

  /**
   * Lấy sản phẩm đề xuất cho user dựa trên Collaborative Filtering
   */
}
