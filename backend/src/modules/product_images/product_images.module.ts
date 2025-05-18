import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { ProductImage } from './entities/product_image.entity';
import { ProductImagesController } from './product_images.controller';
import { ProductImagesService } from './product_images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]),
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
