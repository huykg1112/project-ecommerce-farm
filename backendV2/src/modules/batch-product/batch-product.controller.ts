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
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { BatchProductService } from './batch-product.service';
import { CreateBatchProductDto } from './dto/create-batch-product.dto';
import { UpdateBatchProductDto } from './dto/update-batch-product.dto';

@Controller('batch-product')
export class BatchProductController {
  constructor(private readonly batchService: BatchProductService) {}

  @Post()
  create(@Body() createBatchDto: CreateBatchProductDto, @Req() req) {
    const invenstory_id = req.user.invenstory?.invenstory_id;
    if (!invenstory_id) {
      throw new Error('Invenstory not found for user');
    }
    return this.batchService.create(invenstory_id, createBatchDto);
  }

  @Get()
  findAll(@Req() req) {
    if (req.user.invenstory?.invenstory_id) {
      return this.batchService.findAll(
        req.user.role?.role_name,
        req.user.invenstory.invenstory_id,
      );
    }

    throw new Error('Invenstory not found for user');
  }

  // @Patch()
  // updateMany(@Body() updateBatchDtos: UpdateBatchProductDto[]) {
  //   return this.batchService.updateBatchs(updateBatchDtos);
  // }

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
