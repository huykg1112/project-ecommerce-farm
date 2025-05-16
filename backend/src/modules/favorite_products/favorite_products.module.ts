import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteProduct } from './entities/favorite_product.entity';
import { FavoriteProductsController } from './favorite_products.controller';
import { FavoriteProductsService } from './favorite_products.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteProduct])],
  controllers: [FavoriteProductsController],
  providers: [FavoriteProductsService],
  exports: [FavoriteProductsService],
})
export class FavoriteProductsModule {}
