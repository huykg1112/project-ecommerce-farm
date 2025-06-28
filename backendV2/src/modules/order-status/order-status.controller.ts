import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatusService } from './order-status.service';

@Controller('order-status')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Get()
  findAll() {
    return this.orderStatusService.findAll();
  }

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
