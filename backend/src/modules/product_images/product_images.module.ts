import { Module } from '@nestjs/common';
import { ProductImagesService } from './product_images.service';
import { ProductImagesController } from './product_images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product_image.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([ProductImage]), //
    ],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
})
export class ProductImagesModule {}
