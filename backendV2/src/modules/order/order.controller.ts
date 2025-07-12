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

  @Patch(':id/cancel')
  cancelOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.remove(id);
  }
}
