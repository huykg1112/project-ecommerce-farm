import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImageSerializer } from '../../serializers';
import { Product } from '../product/entities/product.entity';
import { CreateProductImageDto } from './dto/create-product_image.dto';
import { UpdateProductImageDto } from './dto/update-product_image.dto';
import { ProductImage } from './entities/product_image.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductImageDto: CreateProductImageDto) {
    const product = await this.productRepository.findOne({
      where: { product_id: createProductImageDto.product_id },
    });
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    const image = this.productImageRepository.create({
      ...createProductImageDto,
      product,
    });
    const saved = await this.productImageRepository.save(image);
    return {
      message: 'Tạo ảnh sản phẩm thành công',
      data: ProductImageSerializer.serialize(saved),
    };
  }

  async findAll() {
    const images = await this.productImageRepository.find({
      relations: ['product'],
      order: { created_at: 'DESC' },
    });
    return {
      message: 'Lấy danh sách ảnh sản phẩm thành công',
      data: images.map(ProductImageSerializer.serialize),
      total: images.length,
    };
  }

  async findOne(id: string) {
    const image = await this.productImageRepository.findOne({
      where: { product_image_id: id },
      relations: ['product'],
    });
    if (!image) {
      throw new NotFoundException(`Không tìm thấy ảnh với id: ${id}`);
    }
    return {
      message: 'Lấy thông tin ảnh sản phẩm thành công',
      data: ProductImageSerializer.serialize(image),
    };
  }

  async update(id: string, updateProductImageDto: UpdateProductImageDto) {
    const image = await this.productImageRepository.findOne({
      where: { product_image_id: id },
      relations: ['product'],
    });
    if (!image) {
      throw new NotFoundException(`Không tìm thấy ảnh với id: ${id}`);
    }
    if (updateProductImageDto.product_id) {
      const product = await this.productRepository.findOne({
        where: { product_id: updateProductImageDto.product_id },
      });
      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }
      image.product = product;
    }
    Object.assign(image, updateProductImageDto);
    const updated = await this.productImageRepository.save(image);
    return {
      message: 'Cập nhật ảnh sản phẩm thành công',
      data: ProductImageSerializer.serialize(updated),
    };
  }

  async remove(id: string) {
    const image = await this.productImageRepository.findOne({
      where: { product_image_id: id },
    });
    if (!image) {
      throw new NotFoundException(`Không tìm thấy ảnh với id: ${id}`);
    }
    await this.productImageRepository.remove(image);
    return {
      message: 'Xóa ảnh sản phẩm thành công',
      data: { product_image_id: id },
    };
  }
}
