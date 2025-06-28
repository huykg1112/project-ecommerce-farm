import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { ProductImage } from './entities/product_image.entity';
import { ProductImageController } from './product_image.controller';
import { ProductImageService } from './product_image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage, Product])],
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageModule {}
