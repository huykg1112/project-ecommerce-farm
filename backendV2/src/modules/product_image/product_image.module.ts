import { Module } from '@nestjs/common';
import { ProductImageService } from './product_image.service';
import { ProductImageController } from './product_image.controller';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageModule {}
