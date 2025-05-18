import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { ProductImagesService } from './product_images.service';

@Controller('product-images')
export class ProductImagesController {
  constructor(
    private readonly productImagesService: ProductImagesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('product/:productId')
  async getProductImages(@Param('productId') productId: string) {
    return this.productImagesService.findAllByProductId(productId);
  }

  @Post('product/:productId')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('isMain') isMain: boolean = false,
  ) {
    const result = await this.cloudinaryService.uploadImage(file);
    return this.productImagesService.create({
      url: result.url,
      publicId: result.public_id,
      isMain,
      product: { id: productId } as any,
    });
  }

  @Post(':imageId/set-main')
  async setMainImage(
    @Param('imageId') imageId: string,
    @Body('productId') productId: string,
  ) {
    await this.productImagesService.setMainImage(productId, imageId);
    return { message: 'Main image updated successfully' };
  }

  @Delete(':imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    const images = await this.productImagesService.findAllByProductId(imageId);
    const image = images.find(img => img.id === imageId);
    if (image) {
      await this.cloudinaryService.deleteImage(image.publicId);
      await this.productImagesService.deleteImage(imageId);
    }
    return { message: 'Image deleted successfully' };
  }
}
