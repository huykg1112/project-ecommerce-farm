import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BatchCancelOrdersDto, BatchConfirmOrdersDto, BatchUpdateOrderStatusDto } from './dto/batch-order.dto';
import { CancelOrderDto, ConfirmOrderDto } from './dto/confirm-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('my-orders')
  findMyOrders(@Query('user_id', ParseUUIDPipe) userId: string) {
    return this.orderService.findOrdersByUser(userId);
  }

  @Get('my-orders/:id')
  findMyOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('user_id', ParseUUIDPipe) userId: string,
  ) {
    return this.orderService.findOrderByUser(id, userId);
  }

  @Get('distributor-orders')
  findDistributorOrders(
    @Query('distributor_id', ParseUUIDPipe) distributorId: string,
  ) {
    return this.orderService.findOrdersByDistributor(distributorId);
  }

  @Get('statistics')
  getOrderStatistics(
    @Query('distributor_id') distributorId?: string,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ) {
    return this.orderService.getOrderStatistics(
      distributorId,
      fromDate,
      toDate,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Patch(':id/confirm')
  confirmOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() confirmOrderDto: ConfirmOrderDto,
  ) {
    return this.orderService.confirmOrder(id, confirmOrderDto.notes);
  }

  @Patch(':id/cancel')
  cancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelOrderDto: CancelOrderDto,
  ) {
    return this.orderService.cancelOrder(id, cancelOrderDto.notes);
  }

  // Batch operations
  @Patch('batch-status')
  batchUpdateStatus(@Body() batchUpdateStatusDto: BatchUpdateOrderStatusDto) {
    return this.orderService.batchUpdateStatus(
      batchUpdateStatusDto.order_ids,
      batchUpdateStatusDto.status_id,
      batchUpdateStatusDto.notes,
    );
  }

  @Patch('batch-confirm')
  batchConfirmOrders(@Body() batchConfirmDto: BatchConfirmOrdersDto) {
    return this.orderService.batchConfirmOrders(
      batchConfirmDto.order_ids,
      batchConfirmDto.notes,
    );
  }

  @Patch('batch-cancel')
  batchCancelOrders(@Body() batchCancelDto: BatchCancelOrdersDto) {
    return this.orderService.batchCancelOrders(
      batchCancelDto.order_ids,
      batchCancelDto.notes,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.remove(id);
  }
}
