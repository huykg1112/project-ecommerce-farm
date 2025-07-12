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
import { BatchProductService } from './batch-product.service';
import { CreateBatchProductDto } from './dto/create-batch-product.dto';
import { FilterBatchProductDto } from './dto/filter-batch-product.dto';
import { UpdateBatchProductDto } from './dto/update-batch-product.dto';

@Controller('batch-product')
export class BatchProductController {
  constructor(private readonly batchService: BatchProductService) {}

  @Post()
  create(@Body() createBatchDto: CreateBatchProductDto) {
    return this.batchService.create(createBatchDto);
  }

  @Get()
  findAll(@Query() filter: FilterBatchProductDto) {
    return this.batchService.findAll(filter);
  }

  @Patch()
  updateMany(@Body() updateBatchDtos: UpdateBatchProductDto[]) {
    return this.batchService.updateBatchs(updateBatchDtos);
  }

  @Get('expiring-soon')
  findExpiringSoon(@Query('days') days: number) {
    return this.batchService.findExpiringSoon(Number(days) || 7);
  }

  @Get('low-stock')
  findLowStock() {
    return this.batchService.findLowStock();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateBatchProductDto,
  ) {
    return this.batchService.update(id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchService.remove(id);
  }

  @Patch(':id/decrease-quantity')
  decreaseQuantity(@Param('id') id: string, @Body('amount') amount: number) {
    return this.batchService.decreaseQuantity(id, amount);
  }
}
