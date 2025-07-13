import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatusService } from './order-status.service';
import { Public } from '@root/src/public.decorator';

@Controller('order-status')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Public()
  @Get()
  findAll() {
    return this.orderStatusService.findAll();
  }

  @Post()
  createAllStatus() {
    return this.orderStatusService.createDefaultStatuses();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderStatusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderStatusService.update(id, updateOrderStatusDto);
  }
}
