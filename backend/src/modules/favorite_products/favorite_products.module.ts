import { Module } from '@nestjs/common';
import { FavoriteProductsService } from './favorite_products.service';
import { FavoriteProductsController } from './favorite_products.controller';
import { FavoriteProduct } from './entities/favorite_product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoriteProduct]), //
  ],
  controllers: [FavoriteProductsController],
  providers: [FavoriteProductsService],
})
export class FavoriteProductsModule {}
