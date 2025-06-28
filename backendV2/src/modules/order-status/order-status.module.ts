import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusController } from './order-status.controller';
import { OrderStatusService } from './order-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus])],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
})
export class OrderStatusModule {}
