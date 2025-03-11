import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductBatchesService } from './product_batches.service';
import { CreateProductBatchDto } from './dto/create-product_batch.dto';
import { UpdateProductBatchDto } from './dto/update-product_batch.dto';

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
}
