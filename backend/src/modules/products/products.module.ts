import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from '../cart_items/entities/cart_item.entity';
import { Category } from '../categories/entities/category.entity';
import { FavoriteProduct } from '../favorite_products/entities/favorite_product.entity';
import { OrderItem } from '../order_items/entities/order_item.entity';
import { Review } from '../reviews/entities/review.entity';
import { UserModule } from '../users/user.module';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Review,
      OrderItem,
      CartItem,
      FavoriteProduct,
    ]),
    UserModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
