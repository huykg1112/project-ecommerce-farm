import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product_image.entity';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(data: Partial<ProductImage>): Promise<ProductImage> {
    const image = this.productImageRepository.create(data);
    return this.productImageRepository.save(image);
  }

  async findAllByProductId(productId: string): Promise<ProductImage[]> {
    return this.productImageRepository.find({
      where: { product: { id: productId }, isActive: true },
      order: { isMain: 'DESC', createdAt: 'ASC' },
    });
  }

  async setMainImage(productId: string, imageId: string): Promise<void> {
    // Reset all images to non-main
    await this.productImageRepository.update(
      { product: { id: productId } },
      { isMain: false },
    );

    // Set the selected image as main
    await this.productImageRepository.update(
      { id: imageId, product: { id: productId } },
      { isMain: true },
    );
  }

  async deleteImage(imageId: string): Promise<void> {
    await this.productImageRepository.delete(imageId);
  }

  async deactivateImage(imageId: string): Promise<void> {
    await this.productImageRepository.update(imageId, { isActive: false });
  }
}
