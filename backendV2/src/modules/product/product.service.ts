import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm/find-options/operator/In';
import { validate as isUUID } from 'uuid';
import { Role } from '../../auth/enums/role.enum';
import { BatchProduct } from '../batch-product/entities/batch-product.entity';
import { Category } from '../category/entities/category.entity';
import { Manufacturer } from '../manufacturer/entities/manufacturer.entity';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { ProductDisease } from '../product_disease/entities/product_disease.entity';
import { ProductImage } from '../product_image/entities/product_image.entity';
import { User } from '../user/entities/user.entity';
import { AdvancedProductFilterDto } from './dto/advanced-product-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductIngredient)
    private readonly piRepo: Repository<ProductIngredient>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepo: Repository<Manufacturer>,
    @InjectRepository(BatchProduct)
    private readonly batchProductRepo: Repository<BatchProduct>,
    @InjectRepository(ProductDisease)
    private readonly productDiseaseRepo: Repository<ProductDisease>,
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    // Chỉ cho phép Distributor hoặc Admin
    if (
      ![Role.DISTRIBUTOR, Role.ADMIN].includes(user.role?.role_name as Role)
    ) {
      throw new ForbiddenException('Bạn không có quyền tạo sản phẩm');
    }

    // Validate categories
    const categories = await this.categoryRepo.find({
      where: { id: In(createProductDto.category_ids), isDeleted: false },
    });
    if (categories.length !== createProductDto.category_ids.length) {
      throw new NotFoundException('Có category không tồn tại');
    }

    // Validate manufacturer
    if (createProductDto.manufacturer_id) {
      const manufacturer = await this.manufacturerRepo.findOne({
        where: {
          id: createProductDto.manufacturer_id,
          isActive: true,
          isDeleted: false,
        },
      });
      if (!manufacturer) {
        throw new NotFoundException(
          'Nhà sản xuất không tồn tại hoặc đã bị khóa',
        );
      }
    }
    // Validate ingredients với quan hệ nhiều nhiều
    if (createProductDto.ingredient_ids) {
      const ingredients = await this.piRepo.find({
        where: { ingredient_id: In(createProductDto.ingredient_ids) },
      });
      if (ingredients.length !== createProductDto.ingredient_ids.length) {
        throw new NotFoundException('Có thành phần không tồn tại');
      }
    }

    // Validate diseases với quan hệ nhiều nhiều
    if (createProductDto.disease_ids) {
      const diseases = await this.productDiseaseRepo.find({
        where: { disease_id: In(createProductDto.disease_ids) },
      });
      if (diseases.length !== createProductDto.disease_ids.length) {
        throw new NotFoundException('Có bệnh không tồn tại');
      }
    }

    // Validate price
    if (createProductDto.unit_product_price <= 0) {
      throw new BadRequestException('Giá sản phẩm phải lớn hơn 0');
    }

    // Tạo product
    const product = this.productRepo.create({
      ...createProductDto,
      categories,
      distributor: user,
      unit_product_price: createProductDto.unit_product_price,
      // product_ingredients: ingredients,
      // productDiseases: diseases,
    });

    return await this.productRepo.save(product);
  }

  async findAll() {
    return await this.productRepo.find({
      where: { is_deleted: false },
      relations: [
        'images',
        'categories',
        'distributor',
        'distributor.invenstory',
        'manufacturer',
        'product_ingredients',
        'product_ingredients.ingredient',
        'productDiseases',
        'productDiseases.disease',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async findAllForUser() {
    return await this.productRepo.find({
      where: { is_active: true, is_deleted: false },
      relations: [
        'images',
        'categories',
        'distributor',
        'distributor.invenstory',
        'manufacturer',
        'product_ingredients',
        'product_ingredients.ingredient',
        'productDiseases',
        'productDiseases.disease',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async findByDistributor(distributor_id: string) {
    if (!isUUID(distributor_id)) {
      throw new BadRequestException('Invalid distributor ID format');
    }

    return await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.distributor', 'distributor')
      .leftJoinAndSelect('distributor.invenstory', 'invenstory')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.productDiseases', 'productDisease')
      .leftJoinAndSelect('productDisease.disease', 'disease')
      .leftJoinAndSelect('product.product_ingredients', 'product_ingredient')
      .leftJoinAndSelect('product_ingredient.ingredient', 'ingredient')
      .where('distributor.user_id = :distributor_id', { distributor_id })
      .andWhere('product.is_deleted = :is_deleted', { is_deleted: false })
      .orderBy('product.created_at', 'DESC')
      .getMany();
  }

  async findOne(product_id: string) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: [
        'images',
        'categories',
        'distributor',
        'distributor.invenstory',
        'manufacturer',
        'product_ingredients',
        'product_ingredients.ingredient',
        'productDiseases',
        'productDiseases.disease',
      ],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async findOneForUser(product_id: string) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_active: true, is_deleted: false },
      relations: [
        'images',
        'categories',
        'distributor',
        'distributor.invenstory',
        'manufacturer',
        'product_ingredients',
        'product_ingredients.ingredient',
        'productDiseases',
        'productDiseases.disease',
      ],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async update(
    product_id: string,
    updateProductDto: UpdateProductDto,
    user: User,
  ) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: ['distributor'],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    // Chỉ distributor của sản phẩm hoặc admin mới được sửa
    if (
      (user.role?.role_name as Role) !== Role.ADMIN &&
      product.distributor.user_id !== user.user_id
    ) {
      throw new ForbiddenException('Bạn không có quyền sửa sản phẩm này');
    }

    // Validate categories nếu có update
    let categories = product.categories;
    if (updateProductDto.category_ids) {
      categories = await this.categoryRepo.find({
        where: { id: In(updateProductDto.category_ids), isDeleted: false },
      });
      if (categories.length !== updateProductDto.category_ids.length) {
        throw new NotFoundException('Có category không tồn tại');
      }
    }

    // Validate manufacturer nếu có update
    if (updateProductDto.manufacturer_id) {
      const manufacturer = await this.manufacturerRepo.findOne({
        where: {
          id: updateProductDto.manufacturer_id,
          isActive: true,
          isDeleted: false,
        },
      });
      if (!manufacturer) {
        throw new NotFoundException(
          'Nhà sản xuất không tồn tại hoặc đã bị khóa',
        );
      }
    }

    // Validate price
    if (
      updateProductDto.unit_product_price &&
      updateProductDto.unit_product_price <= 0
    ) {
      throw new BadRequestException('Giá sản phẩm phải lớn hơn 0');
    }

    // Update product
    Object.assign(product, updateProductDto, {
      categories,
      updated_at: new Date(),
    });

    return await this.productRepo.save(product);
  }

  async remove(product_id: string, user: User) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: ['distributor'],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    // Check permission
    if (
      (user.role?.role_name as Role) !== Role.ADMIN &&
      product.distributor.user_id !== user.user_id
    ) {
      throw new ForbiddenException('Bạn không có quyền xóa sản phẩm này');
    }

    // Check if product has active batch products
    const activeBatches = await this.batchProductRepo.find({
      where: { product: { product_id }, is_active: true },
    });

    if (activeBatches.length > 0) {
      throw new BadRequestException(
        'Không thể xóa sản phẩm có lô hàng đang hoạt động',
      );
    }

    // Soft delete
    product.is_deleted = true;
    product.updated_at = new Date();
    await this.productRepo.save(product);

    return { message: 'Xóa sản phẩm thành công' };
  }

  async getIngredientsForProduct(product_id: string) {
    return await this.piRepo.find({
      where: { product_id },
      relations: ['ingredient'],
    });
  }

  async getDiseasesForProduct(product_id: string) {
    return await this.productDiseaseRepo.find({
      where: { product_id },
      relations: ['disease'],
    });
  }

  serializeProduct(product: Product) {
    const reviews = product.reviews || [];
    const avg_rating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : null;

    return {
      product_id: product.product_id,
      product_name: product.product_name,
      description: product.description,
      usage_instructions: product.usage_instructions,
      unit_product_price: product.unit_product_price,
      is_active: product.is_active,
      created_at: product.created_at,
      updated_at: product.updated_at,
      categories: (product.categories || []).map((c) => ({
        category_id: c.id,
        category_name: c.name,
      })),
      manufacturer: product.manufacturer
        ? {
            id: product.manufacturer.id,
            name: product.manufacturer.name,
            logo: product.manufacturer.logo,
          }
        : null,
      distributor: product.distributor
        ? {
            user_id: product.distributor.user_id,
            full_name: product.distributor.full_name,
            invenstory_id: product.distributor.invenstory?.invenstory_id,
          }
        : null,
      images: product['images'] || [],
      reviews: reviews.map((r) => ({
        review_id: r['review_id'],
        rating: r['rating'],
        comment: r['comment'],
        created_at: r['created_at'],
      })),
      avg_rating,
      product_ingredients: (product.product_ingredients || []).map((pi) => ({
        ingredient_id: pi.ingredient?.ingredient_id,
        ingredient_name: pi.ingredient?.ingredient_name,
        is_primary: pi.is_primary,
      })),
      diseases: (product.productDiseases || []).map((pd) => ({
        disease_id: pd.disease?.disease_id,
        disease_name: pd.disease?.disease_name,
        is_primary: pd.is_primary,
      })),
    };
  }

  async advancedSearchProducts(filter: AdvancedProductFilterDto) {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.distributor', 'distributor')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      // ... other joins
      .where('product.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('product.is_active = :is_active', { is_active: true });

    // Basic search (từ 'keyword' thành 'search')
    if (filter.search) {
      qb.andWhere(
        `(
        LOWER(product.product_name) LIKE :search
        OR LOWER(product.description) LIKE :search
        OR LOWER(manufacturer.name) LIKE :search
      )`,
        { search: `%${filter.search.toLowerCase()}%` },
      );
    }

    // Single category filter
    if (filter.category_id) {
      qb.andWhere('category.id = :category_id', {
        category_id: filter.category_id,
      });
    }

    // Multi category filter
    if (filter.category_ids && filter.category_ids.length > 0) {
      qb.andWhere('category.id IN (:...category_ids)', {
        category_ids: filter.category_ids,
      });
    }

    // Status filter
    if (filter.status && filter.status !== 'all') {
      qb.andWhere('product.is_active = :is_active', {
        is_active: filter.status === 'active',
      });
    }

    // Price range
    if (filter.price_min !== undefined) {
      qb.andWhere('product.unit_product_price >= :price_min', {
        price_min: filter.price_min,
      });
    }

    if (filter.price_max !== undefined) {
      qb.andWhere('product.unit_product_price <= :price_max', {
        price_max: filter.price_max,
      });
    }

    // Rating range
    if (filter.rating_min !== undefined) {
      qb.having('AVG(review.rating) >= :rating_min', {
        rating_min: filter.rating_min,
      });
    }

    if (filter.rating_max !== undefined) {
      qb.having('AVG(review.rating) <= :rating_max', {
        rating_max: filter.rating_max,
      });
    }

    // Sorting
    if (filter.sort_by) {
      const sortField =
        filter.sort_by === 'name'
          ? 'product.product_name'
          : filter.sort_by === 'price'
            ? 'product.unit_product_price'
            : 'product.created_at';

      qb.orderBy(
        sortField,
        (filter.sort_order?.toUpperCase() as 'ASC' | 'DESC') || 'DESC',
      );
    }

    // Pagination
    if (filter.page && filter.limit) {
      const skip = (filter.page - 1) * filter.limit;
      qb.skip(skip).take(filter.limit);
    }

    const [products, total] = await qb.getManyAndCount();

    return {
      data: products.map((p) => this.serializeProduct(p)),
      length: products.length,
      pagination: {
        page: filter.page || 1,
        limit: filter.limit || 10,
        total,
        totalPages: Math.ceil(total / (filter.limit || 10)),
      },
    };
  }

  // Thêm methods bổ sung
  async toggleStatus(product_id: string, user: User) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: ['distributor'],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    // Check permission
    if (
      (user.role?.role_name as Role) !== Role.ADMIN &&
      product.distributor.user_id !== user.user_id
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền thay đổi trạng thái sản phẩm này',
      );
    }

    product.is_active = !product.is_active;
    product.updated_at = new Date();
    return await this.productRepo.save(product);
  }

  async batchToggleStatus(product_ids: string[], user: User) {
    const products = await this.productRepo.find({
      where: { product_id: In(product_ids), is_deleted: false },
      relations: ['distributor'],
    });

    // Filter products user can modify
    const allowedProducts = products.filter(
      (product) =>
        (user.role?.role_name as Role) === Role.ADMIN ||
        product.distributor.user_id === user.user_id,
    );

    // Toggle status for allowed products
    for (const product of allowedProducts) {
      product.is_active = !product.is_active;
      product.updated_at = new Date();
    }

    await this.productRepo.save(allowedProducts);
    return {
      message: `Cập nhật trạng thái cho ${allowedProducts.length} sản phẩm`,
    };
  }

  async batchDelete(product_ids: string[], user: User) {
    const products = await this.productRepo.find({
      where: { product_id: In(product_ids), is_deleted: false },
      relations: ['distributor'],
    });

    // Filter products user can delete
    const allowedProducts = products.filter(
      (product) =>
        (user.role?.role_name as Role) === Role.ADMIN ||
        product.distributor.user_id === user.user_id,
    );

    // Soft delete allowed products
    for (const product of allowedProducts) {
      product.is_deleted = true;
      product.updated_at = new Date();
    }

    await this.productRepo.save(allowedProducts);
    return { message: `Xóa ${allowedProducts.length} sản phẩm thành công` };
  }
  async batchSetStatus(product_ids: string[], is_active: boolean, user: User) {
    const products = await this.productRepo.find({
      where: { product_id: In(product_ids), is_deleted: false },
      relations: ['distributor'],
    });

    const allowedProducts = products.filter(
      (product) =>
        (user.role?.role_name as Role) === Role.ADMIN ||
        product.distributor.user_id === user.user_id,
    );

    for (const product of allowedProducts) {
      product.is_active = is_active;
      product.updated_at = new Date();
    }

    await this.productRepo.save(allowedProducts);
    return {
      message: `${is_active ? 'Kích hoạt' : 'Tạm dừng'} ${allowedProducts.length} sản phẩm thành công`,
    };
  }

  async getProductStats(distributorId?: string) {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .where('product.is_deleted = false');

    if (distributorId) {
      qb.andWhere('product.distributor.user_id = :distributorId', {
        distributorId,
      });
    }

    const [total, active, inactive] = await Promise.all([
      qb.getCount(),
      qb.clone().andWhere('product.is_active = true').getCount(),
      qb.clone().andWhere('product.is_active = false').getCount(),
    ]);

    const avgPriceResult = await qb
      .select('AVG(product.unit_product_price)', 'avg_price')
      .getRawOne();

    return {
      total_products: total,
      active_products: active,
      inactive_products: inactive,
      avg_price: parseFloat(avgPriceResult.avg_price) || 0,
    };
  }
  async findAllWithPagination(filters: ProductFilterDto) {
    const {
      search,
      category_id,
      manufacturer_id,
      distributor_id,
      status,
      price_min,
      price_max,
      rating_min,
      sort_by = 'created_at',
      sort_order = 'desc',
      page = 1,
      limit = 10,
    } = filters;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.distributor', 'distributor')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.product_ingredients', 'product_ingredient')
      .leftJoinAndSelect('product_ingredient.ingredient', 'ingredient')
      .leftJoinAndSelect('product.productDiseases', 'productDisease')
      .leftJoinAndSelect('productDisease.disease', 'disease')
      .leftJoinAndSelect('product.reviews', 'review')
      .where('product.is_deleted = :is_deleted', { is_deleted: false });

    // Apply filters
    if (search) {
      qb.andWhere(
        `(
        LOWER(product.product_name) LIKE :search
        OR LOWER(product.description) LIKE :search
        OR LOWER(manufacturer.name) LIKE :search
        OR LOWER(distributor.full_name) LIKE :search
      )`,
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (category_id) {
      qb.andWhere('category.id = :category_id', { category_id });
    }

    if (manufacturer_id) {
      qb.andWhere('manufacturer.id = :manufacturer_id', { manufacturer_id });
    }

    if (distributor_id) {
      qb.andWhere('distributor.user_id = :distributor_id', { distributor_id });
    }

    if (status && status !== 'all') {
      qb.andWhere('product.is_active = :is_active', {
        is_active: status === 'active',
      });
    }

    if (price_min !== undefined) {
      qb.andWhere('product.unit_product_price >= :price_min', { price_min });
    }

    if (price_max !== undefined) {
      qb.andWhere('product.unit_product_price <= :price_max', { price_max });
    }

    // Apply sorting
    const sortField =
      sort_by === 'name'
        ? 'product.product_name'
        : sort_by === 'price'
          ? 'product.unit_product_price'
          : 'product.created_at';

    qb.orderBy(sortField, sort_order.toUpperCase() as 'ASC' | 'DESC');

    // Apply pagination
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [products, total] = await qb.getManyAndCount();

    return {
      data: products.map((p) => this.serializeProduct(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addImagesToProduct(
    product_id: string,
    imageUrls: string[],
    user: User,
  ) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: ['images', 'distributor'],
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (
      user.role?.role_name !== Role.ADMIN &&
      product.distributor.user_id !== user.user_id
    ) {
      throw new Error('Permission denied');
    }

    const newImages = imageUrls.map((url) => {
      return this.productImageRepo.create({
        product,
        image_url: url,
      });
    });

    await this.productImageRepo.save(newImages);

    return { message: 'Images added successfully', images: newImages };
  }

  async removeImagesFromProduct(
    product_id: string,
    imageIds: string[],
    user: User,
  ) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: ['images', 'distributor'],
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (
      user.role?.role_name !== Role.ADMIN &&
      product.distributor.user_id !== user.user_id
    ) {
      throw new Error('Permission denied');
    }

    const imagesToRemove = await this.productImageRepo.findByIds(imageIds);

    if (
      imagesToRemove.some((image) => image.product.product_id !== product_id)
    ) {
      throw new Error('Some images do not belong to the specified product');
    }

    await this.productImageRepo.remove(imagesToRemove);

    return { message: 'Images removed successfully' };
  }
}
