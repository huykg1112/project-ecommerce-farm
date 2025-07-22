import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchProductModule } from '../batch-product/batch-product.module';
import { BatchProduct } from '../batch-product/entities/batch-product.entity';
import { OrderDetail } from '../order-detail/entities/order-detail.entity';
import { OrderDetailModule } from '../order-detail/order-detail.module';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { OrderStatusModule } from '../order-status/order-status.module';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      OrderStatus,
      PaymentMethod,
      User,
      BatchProduct,
      Product,
    ]),
    forwardRef(() => BatchProductModule),
    forwardRef(() => OrderDetailModule),
    OrderStatusModule,
    PaymentMethodModule,
    UserModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
