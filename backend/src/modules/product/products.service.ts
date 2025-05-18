import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { Category } from '../categories/entities/category.entity';
import { ProductImage } from '../product_images/entities/product_image.entity';
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
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  private validateDiscountDates(startDate: Date | null, endDate: Date | null): boolean {
    if (!startDate || !endDate) return false;
    const now = new Date();
    return startDate <= now && now <= endDate;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryIds, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      product.categories = categories;
    }

    // Validate discount dates if provided
    if (product.discountPrice && product.discountStartDate && product.discountEndDate) {
      if (!this.validateDiscountDates(product.discountStartDate, product.discountEndDate)) {
        product.discountPrice = null;
        product.discountStartDate = null;
        product.discountEndDate = null;
      }
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

    // Add discount validation
    const now = new Date();
    queryBuilder.andWhere(
      '(product.discountPrice IS NULL OR (product.discountStartDate <= :now AND product.discountEndDate >= :now))',
      { now },
    );

    switch (sortBy) {
      case SortOrder.POPULAR:
        queryBuilder.orderBy('product.totalSales', 'DESC');
        break;
      case SortOrder.NEWEST:
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
      case SortOrder.PRICE_LOW_TO_HIGH:
        queryBuilder.orderBy('COALESCE(product.discountPrice, product.price)', 'ASC');
        break;
      case SortOrder.PRICE_HIGH_TO_LOW:
        queryBuilder.orderBy('COALESCE(product.discountPrice, product.price)', 'DESC');
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

    // Check if discount is still valid
    if (product.discountPrice && product.discountStartDate && product.discountEndDate) {
      if (!this.validateDiscountDates(product.discountStartDate, product.discountEndDate)) {
        product.discountPrice = null;
        product.discountStartDate = null;
        product.discountEndDate = null;
        await this.productRepository.save(product);
      }
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { categoryIds, ...updateData } = updateProductDto;

    const product = await this.findOne(id);

    // Validate discount dates if provided
    if (updateData.discountPrice && updateData.discountStartDate && updateData.discountEndDate) {
      if (!this.validateDiscountDates(updateData.discountStartDate, updateData.discountEndDate)) {
        updateData.discountPrice = null;
        updateData.discountStartDate = null;
        updateData.discountEndDate = null;
      }
    }

    Object.assign(product, updateData);

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
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

  async updateProductImage(id: string, imageUrl: string, publicId: string) {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['images']
    });
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Tạo ảnh mới
    const newImage = this.productImageRepository.create({
      url: imageUrl,
      publicId: publicId,
      isMain: product.images.length === 0, // Nếu là ảnh đầu tiên thì set làm ảnh chính
      product: { id }
    });
    
    await this.productImageRepository.save(newImage);

    return this.productRepository.findOne({
      where: { id },
      relations: ['images']
    });
  }

  async deleteProductImage(productId: string, imageId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images']
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const image = product.images.find(img => img.id === imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // Xóa ảnh từ Cloudinary
    await this.cloudinaryService.deleteImage(image.publicId);

    // Nếu là ảnh chính và còn ảnh khác, set ảnh đầu tiên làm ảnh chính
    if (image.isMain && product.images.length > 1) {
      const nextMainImage = product.images.find(img => img.id !== imageId);
      if (nextMainImage) {
        nextMainImage.isMain = true;
        await this.productImageRepository.save(nextMainImage);
      }
    }

    // Xóa ảnh từ database
    await this.productImageRepository.delete(imageId);

    return this.productRepository.findOne({
      where: { id: productId },
      relations: ['images']
    });
  }

  async deleteAllProductImages(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images']
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Xóa tất cả ảnh từ Cloudinary
    for (const image of product.images) {
      await this.cloudinaryService.deleteImage(image.publicId);
    }

    // Xóa tất cả ảnh từ database
    await this.productImageRepository.delete({ product: { id: productId } });

    return this.productRepository.findOne({
      where: { id: productId },
      relations: ['images']
    });
  }

  async setMainImage(productId: string, imageId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images']
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const targetImage = product.images.find(img => img.id === imageId);
    if (!targetImage) {
      throw new Error('Image not found');
    }

    // Reset tất cả ảnh về không phải ảnh chính
    await this.productImageRepository.update(
      { product: { id: productId } },
      { isMain: false }
    );

    // Set ảnh được chọn làm ảnh chính
    targetImage.isMain = true;
    await this.productImageRepository.save(targetImage);

    return this.productRepository.findOne({
      where: { id: productId },
      relations: ['images']
    });
  }
}
