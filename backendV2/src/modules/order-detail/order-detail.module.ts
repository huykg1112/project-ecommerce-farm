import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchProductModule } from '../batch-product/batch-product.module';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail]), BatchProductModule],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
