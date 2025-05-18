import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { AlertThresholdDto, ProductAlertDto } from './dto/alert.dto';
import { CreateProductBatchDto } from './dto/create-product_batch.dto';
import { UpdateProductBatchDto } from './dto/update-product_batch.dto';
import { ProductBatchesService } from './product_batches.service';


@Controller('product-batches')
export class ProductBatchesController {
  constructor(private readonly productBatchesService: ProductBatchesService) {}

  @Post()
  create(@Body() createProductBatchDto: CreateProductBatchDto) {
    return this.productBatchesService.create(createProductBatchDto);
  }

  @Get()
  findAll() {
    return this.productBatchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productBatchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductBatchDto: UpdateProductBatchDto) {
    return this.productBatchesService.update(+id, updateProductBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productBatchesService.remove(+id);
  }

  @Get('alerts/expiring')
 
  async getExpiringProducts(
    @Query('days') days?: number,
    @Query('distributorId') distributorId?: string
  ): Promise<ProductAlertDto[]> {
    return this.productBatchesService.getExpiringProducts(days, distributorId);
  }

  @Get('alerts/low-stock')
 
  async getLowStockProducts(
    @Query('threshold') threshold?: number,
    @Query('distributorId') distributorId?: string
  ): Promise<ProductAlertDto[]> {
    return this.productBatchesService.getLowStockProducts(threshold, distributorId);
  }

  @Get('alerts')

  async getAllAlerts(
    @Query() thresholds: AlertThresholdDto
  ): Promise<ProductAlertDto[]> {
    return this.productBatchesService.getAllAlerts(thresholds);
  }
}
