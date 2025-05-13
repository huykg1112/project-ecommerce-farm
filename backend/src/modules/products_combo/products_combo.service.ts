import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { ProductsService } from '../product/products.service';
import { UserService } from '../users/user.service';
import { CreateProductsComboDto } from './dto/create-products-combo.dto';
import { ProductsCombo } from './entities/products_combo.entity';
import { ProductsComboSerializer } from './serializers/products-combo.serializer';

@Injectable()
export class ProductsComboService {
  constructor(
    @InjectRepository(ProductsCombo)
    private readonly productsComboRepository: Repository<ProductsCombo>,

    private readonly ProductsService: ProductsService,

    private readonly userService: UserService,
  ) {}

  async create(createProductsComboDto: CreateProductsComboDto, userId: string) {
    const distributor = await this.userService.findById(userId);
    if (!distributor || distributor.role.name !== 'distributor') {
      throw new BadRequestException('Chỉ đại lý mới có thể tạo combo');
    }

    // Lấy thông tin sản phẩm và kiểm tra số lượng
    const products: Product[] = [];
    let totalPrice = 0;

    for (const item of createProductsComboDto.products) {
      const product = await this.ProductsService.findOne(
        item.productId
      );

      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${item.productId}`);
      }

      // Kiểm tra xem sản phẩm có thuộc đại lý này không
      if (product.distributor.id !== userId) {
        throw new BadRequestException(`Sản phẩm ${product.name} không thuộc đại lý của bạn`);
      }

      // Kiểm tra số lượng trong kho
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${product.name} chỉ còn ${product.stock} trong kho`);
      }

      products.push(product);
      totalPrice += product.price * item.quantity;
    }

    // Tính giá sau khi giảm giá
    let discountPrice = totalPrice;
    if (createProductsComboDto.discountPercentage) {
      discountPrice = totalPrice * (1 - createProductsComboDto.discountPercentage / 100);
    }

    const combo = this.productsComboRepository.create({
      ...createProductsComboDto,
      originalPrice: totalPrice,
      discountPrice,
      distributor,
      products,
    });

    const savedCombo = await this.productsComboRepository.save(combo);
    return plainToInstance(ProductsComboSerializer, savedCombo);
  }

  async findAll() {
    const combos = await this.productsComboRepository.find({
      relations: ['products', 'distributor'],
      where: { isActive: true },
    });
    return plainToInstance(ProductsComboSerializer, combos);
  }

  async findOne(id: string) {
    const combo = await this.productsComboRepository.findOne({
      where: { id },
      relations: ['products', 'distributor'],
    });
    if (!combo) {
      throw new NotFoundException('Không tìm thấy combo');
    }
    return plainToInstance(ProductsComboSerializer, combo);
  }

  async findByDistributor(distributorId: string) {
    const combos = await this.productsComboRepository.find({
      where: { distributor: { id: distributorId } },
      relations: ['products', 'distributor'],
    });
    return plainToInstance(ProductsComboSerializer, combos);
  }

  async toggleActive(id: string, userId: string) {
    const combo = await this.productsComboRepository.findOne({
      where: { id },
      relations: ['distributor'],
    });

    if (!combo) {
      throw new NotFoundException('Không tìm thấy combo');
    }

    if (combo.distributor.id !== userId) {
      throw new BadRequestException('Bạn không có quyền thay đổi trạng thái combo này');
    }

    combo.isActive = !combo.isActive;
    const updatedCombo = await this.productsComboRepository.save(combo);
    return plainToInstance(ProductsComboSerializer, updatedCombo);
  }
}
