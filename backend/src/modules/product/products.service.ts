import { Category } from '@modules/categories/entities/category.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto, SortOrder } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);

    if (categoryId && categoryId.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In([categoryId]),
      });
      product.categories = categories;
    }

    return await this.productRepository.save(product);
  }

  async findAll(
    searchDto: SearchProductDto,
  ): Promise<{ products: Product[]; total: number }> {
    const {
      name,
      categoryIds,
      minRating,
      dealerIds,
      sortBy,
      page = 1,
      limit = 10,
    } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('product.distributor', 'distributor');

    if (name) {
      queryBuilder.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    if (categoryIds && categoryIds.length > 0) {
      queryBuilder.innerJoin(
        'product.categories',
        'filterCategory',
        'filterCategory.id IN (:...categoryIds)',
        { categoryIds },
      );
    }

    if (minRating) {
      queryBuilder.andWhere('product.averageRating >= :minRating', {
        minRating,
      });
    }

    if (dealerIds && dealerIds.length > 0) {
      queryBuilder.andWhere('distributor.id IN (:...dealerIds)', {
        dealerIds,
      });
    }

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
      relations: ['categories', 'reviews', 'distributor', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { categoryId, ...updateData } = updateProductDto;

    const product = await this.findOne(id);

    Object.assign(product, updateData);

    if (categoryId && categoryId.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In([categoryId]),
      });
      product.categories = categories;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async getRecommendations(userId: string): Promise<Product[]> {
    const userProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('product.cartItems', 'cartItem')
      .leftJoin('product.favorites', 'favorite')
      .where('order.userId = :userId', { userId })
      .orWhere('cartItem.userId = :userId', { userId })
      .orWhere('favorite.userId = :userId', { userId })
      .getMany();

    const userCategoryIds: string[] = [];
    for (const product of userProducts) {
      if (product.categories) {
        for (const category of product.categories) {
          userCategoryIds.push(category.id);
        }
      }
    }

    const uniqueUserCategoryIds = [...new Set(userCategoryIds)];

    if (uniqueUserCategoryIds.length > 0) {
      return await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.categories', 'category')
        .innerJoin(
          'product.categories',
          'filterCategory',
          'filterCategory.id IN (:...userCategoryIds)',
          { userCategoryIds: uniqueUserCategoryIds },
        )
        .where('product.id NOT IN (:...userProductIds)', {
          userProductIds:
            userProducts.map((p) => p.id).length > 0
              ? userProducts.map((p) => p.id)
              : ['00000000-0000-0000-0000-000000000000'],
        })
        .orderBy('product.averageRating', 'DESC')
        .take(10)
        .getMany();
    }

    return this.productRepository.find({
      order: { averageRating: 'DESC' },
      take: 10,
      relations: ['categories'],
    });
  }
}
