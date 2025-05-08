import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto, SortOrder } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(searchDto: SearchProductDto): Promise<{ products: Product[]; total: number }> {
    const { name, categoryIds, minRating, dealerIds, sortBy, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.reviews', 'reviews');

    // Apply filters
    if (name) {
      queryBuilder.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    if (categoryIds && categoryIds.length > 0) {
      queryBuilder.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    if (minRating) {
      queryBuilder.andWhere('product.averageRating >= :minRating', { minRating });
    }

    if (dealerIds && dealerIds.length > 0) {
      queryBuilder.andWhere('product.dealerId IN (:...dealerIds)', { dealerIds });
    }

    // Apply sorting
    switch (sortBy) {
      case SortOrder.POPULAR:
        queryBuilder.orderBy('product.totalSales', 'DESC');
        break;
      case SortOrder.NEWEST:
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
      case SortOrder.PRICE_LOW_TO_HIGH:
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case SortOrder.PRICE_HIGH_TO_LOW:
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case SortOrder.RATING:
        queryBuilder.orderBy('product.averageRating', 'DESC');
        break;
      default:
        queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { products, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async getRecommendations(userId: string): Promise<Product[]> {
    // Get user's purchase history, cart items, and favorites
    const userProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('product.cartItems', 'cartItem')
      .leftJoin('product.favorites', 'favorite')
      .where('orderItem.userId = :userId', { userId })
      .orWhere('cartItem.userId = :userId', { userId })
      .orWhere('favorite.userId = :userId', { userId })
      .getMany();

    // Get categories of user's products
    const userCategories = [...new Set(userProducts.map(p => p.category?.id))];

    // Get similar products based on categories and ratings
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('category.id IN (:...userCategories)', { userCategories })
      .andWhere('product.id NOT IN (:...userProductIds)', { 
        userProductIds: userProducts.map(p => p.id) 
      })
      .orderBy('product.averageRating', 'DESC')
      .take(10)
      .getMany();
  }
}
