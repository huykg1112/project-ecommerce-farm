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
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { ActiveIngredient } from '../active-ingredient/entities/active-ingredient.entity';
import { BatchProduct } from '../batch-product/entities/batch-product.entity';
import { Category } from '../category/entities/category.entity';
import { Disease } from '../disease/entities/disease.entity';
import { Manufacturer } from '../manufacturer/entities/manufacturer.entity';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { ProductDisease } from '../product_disease/entities/product_disease.entity';
import { ProductImage } from '../product_image/entities/product_image.entity';
import { User } from '../user/entities/user.entity';
import { AdvancedProductFilterDto } from './dto/advanced-product-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { PredictionScore, SimilarUser } from './dto/recommendation.dto';
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
    @InjectRepository(ActiveIngredient)
    private readonly activeIngredientRepo: Repository<ActiveIngredient>,
    @InjectRepository(Disease)
    private readonly diseaseRepo: Repository<Disease>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    user: User,
  ) {
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
    let manufacturer: Manufacturer | null = null;
    if (createProductDto.manufacturer_id) {
      manufacturer = await this.manufacturerRepo.findOne({
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

    // Validate ingredients
    let validatedIngredients: ActiveIngredient[] = [];
    if (
      createProductDto.ingredient_ids &&
      createProductDto.ingredient_ids.length > 0
    ) {
      validatedIngredients = await this.activeIngredientRepo.find({
        where: {
          ingredient_id: In(createProductDto.ingredient_ids),
          is_deleted: false,
        },
      });
      if (
        validatedIngredients.length !== createProductDto.ingredient_ids.length
      ) {
        throw new NotFoundException('Có thành phần không tồn tại');
      }
    }

    // Validate diseases
    let validatedDiseases: Disease[] = [];
    if (
      createProductDto.disease_ids &&
      createProductDto.disease_ids.length > 0
    ) {
      validatedDiseases = await this.diseaseRepo.find({
        where: {
          disease_id: In(createProductDto.disease_ids),
          is_deleted: false,
        },
      });
      if (validatedDiseases.length !== createProductDto.disease_ids.length) {
        throw new NotFoundException('Có bệnh không tồn tại');
      }
    }

    // Validate price
    const unit_product_price = parseFloat(
      createProductDto?.unit_product_price || '0',
    );
    if (unit_product_price <= 0) {
      throw new BadRequestException('Giá sản phẩm phải lớn hơn 0');
    }

    // Upload hình ảnh lên Cloudinary
    let uploadedImages: { url: string; public_id: string }[] = [];
    if (files && files.length > 0) {
      try {
        uploadedImages = await this.cloudinaryService.uploadImages(files);
      } catch (error) {
        throw new BadRequestException(`Lỗi upload hình ảnh: ${error.message}`);
      }
    }

    // Tạo product
    const product = this.productRepo.create({
      product_name: createProductDto.product_name,
      description: createProductDto.description,
      usage_instructions: createProductDto.usage_instructions,
      unit_product_price: unit_product_price,
      is_active: createProductDto.is_active ?? true,
      categories,
      productDiseases: validatedDiseases,
      product_ingredients: validatedIngredients,
      distributor: user,
      manufacturer: manufacturer ?? undefined,
    });

    // Lưu product trước
    const savedProduct = await this.productRepo.save(product);

    // Tạo liên kết ingredients nếu có
    if (validatedIngredients.length > 0) {
      const productIngredients = validatedIngredients.map((ingredient) =>
        this.piRepo.create({
          product_id: savedProduct.product_id,
          ingredient_id: ingredient.ingredient_id,
          product: savedProduct,
          ingredient: ingredient,
          //lấy hình ảnh đầu tiên làm primary
          is_primary:
            ingredient.ingredient_id === validatedIngredients[0].ingredient_id,
        }),
      );
      await this.piRepo.save(productIngredients);
    }

    // Tạo liên kết diseases nếu có
    if (validatedDiseases.length > 0) {
      const productDiseases = validatedDiseases.map((disease) =>
        this.productDiseaseRepo.create({
          product_id: savedProduct.product_id,
          disease_id: disease.disease_id,
          product: savedProduct,
          disease: disease,
          is_primary: false, // Có thể thêm logic để xác định primary
        }),
      );
      await this.productDiseaseRepo.save(productDiseases);
    }

    // Tạo liên kết hình ảnh nếu có
    if (uploadedImages.length > 0) {
      const productImages = uploadedImages.map((image) =>
        this.productImageRepo.create({
          product: savedProduct,
          image_url: image.url,
          description: `Product image for ${savedProduct.product_name}`,
        }),
      );
      await this.productImageRepo.save(productImages);
    }

    // Trả về product với đầy đủ thông tin liên kết
    return await this.findOne(savedProduct.product_id);
  }

  async findAll() {
    const relations = [
      'images',
      'categories',
      'distributor',
      'distributor.invenstory',
      'manufacturer',
      'reviews',
      'reviews.user',
      'reviews.distributor',
      'reviews.parent_review',
      'batches',
      'batches.product_types',
      'batches.promotions',
      'product_ingredients',
      'product_ingredients.ingredient',
      'productDiseases',
      'productDiseases.disease',
    ];
    return await this.productRepo.find({
      where: { is_deleted: false },
      relations: relations,
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
        'batches',
        'batches.product_types',
        'batches.promotions',
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
        'batches',
        'batches.product_types',
        'batches.promotions',
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
        'batches',
        'batches.product_types',
        'batches.promotions',
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
    files: Express.Multer.File[],
    user: User,
  ) {
    console.log('Update Product:', updateProductDto);

    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: ['distributor'],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    // Kiểm tra quyền sửa
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
    let manufacturer: Manufacturer | null = product?.manufacturer || null;
    if (updateProductDto.manufacturer_id) {
      manufacturer = await this.manufacturerRepo.findOne({
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

    // Validate ingredients
    let validatedIngredients: ActiveIngredient[] = [];
    if (
      updateProductDto.ingredient_ids &&
      updateProductDto.ingredient_ids.length > 0
    ) {
      validatedIngredients = await this.activeIngredientRepo.find({
        where: {
          ingredient_id: In(updateProductDto.ingredient_ids),
          is_deleted: false,
        },
      });
      if (
        validatedIngredients.length !== updateProductDto.ingredient_ids.length
      ) {
        throw new NotFoundException('Có thành phần không tồn tại');
      }
    }

    // Validate diseases
    let validatedDiseases: Disease[] = [];
    if (
      updateProductDto.disease_ids &&
      updateProductDto.disease_ids.length > 0
    ) {
      validatedDiseases = await this.diseaseRepo.find({
        where: {
          disease_id: In(updateProductDto.disease_ids),
          is_deleted: false,
        },
      });
      if (validatedDiseases.length !== updateProductDto.disease_ids.length) {
        throw new NotFoundException('Có bệnh không tồn tại');
      }
    }

    // Validate price
    const unit_product_price = parseFloat(
      updateProductDto?.unit_product_price || '0',
    );
    if (unit_product_price <= 0) {
      throw new BadRequestException('Giá sản phẩm phải lớn hơn 0');
    }

    // Upload hình ảnh mới nếu có
    let uploadedImages: { url: string; public_id: string }[] = [];
    if (files && files.length > 0) {
      try {
        uploadedImages = await this.cloudinaryService.uploadImages(files);
      } catch (error) {
        throw new BadRequestException(`Lỗi upload hình ảnh: ${error.message}`);
      }
    }

    // Cập nhật thông tin sản phẩm
    Object.assign(product, {
      product_name: updateProductDto.product_name || product.product_name,
      description: updateProductDto.description || product.description,
      usage_instructions:
        updateProductDto.usage_instructions || product.usage_instructions,
      unit_product_price: unit_product_price || product.unit_product_price,
      is_active: updateProductDto.is_active ?? product.is_active,
      categories,
      manufacturer: manufacturer ?? undefined,
      updated_at: new Date(),
    });

    const updatedProduct = await this.productRepo.save(product);

    // Cập nhật ingredients nếu có
    if (updateProductDto.ingredient_ids) {
      // Xóa liên kết cũ
      await this.piRepo.delete({ product_id });

      // Tạo liên kết mới
      const productIngredients = validatedIngredients.map((ingredient) =>
        this.piRepo.create({
          product_id: updatedProduct.product_id, // Đảm bảo giá trị không null
          ingredient_id: ingredient.ingredient_id,
          product: updatedProduct,
          ingredient: ingredient,
          is_primary: false,
        }),
      );
      await this.piRepo.save(productIngredients);
    }

    // Cập nhật diseases nếu có
    if (updateProductDto.disease_ids) {
      await this.productDiseaseRepo.delete({ product_id });

      const productDiseases = validatedDiseases.map((disease) =>
        this.productDiseaseRepo.create({
          product_id: updatedProduct.product_id, // Đảm bảo giá trị không null
          disease_id: disease.disease_id,
          product: updatedProduct,
          disease: disease,
          is_primary: false,
        }),
      );
      await this.productDiseaseRepo.save(productDiseases);
    }

    // Thêm hình ảnh mới nếu có (không xóa hình cũ)
    if (uploadedImages.length > 0) {
      const productImages = uploadedImages.map((image) =>
        this.productImageRepo.create({
          product: updatedProduct,
          image_url: image.url,
          description: `Product image for ${updatedProduct.product_name}`,
        }),
      );
      await this.productImageRepo.save(productImages);
    }

    // Trả về product với đầy đủ thông tin liên kết
    return await this.findOne(updatedProduct.product_id);
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
    files: Express.Multer.File[],
    user: User,
  ) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: ['images', 'distributor'],
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    if (
      user.role?.role_name !== Role.ADMIN &&
      product.distributor.user_id !== user.user_id
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền thêm hình ảnh cho sản phẩm này',
      );
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất một hình ảnh');
    }

    // Upload hình ảnh lên Cloudinary
    let uploadedImages: { url: string; public_id: string }[] = [];
    try {
      uploadedImages = await this.cloudinaryService.uploadImages(files);
    } catch (error) {
      throw new BadRequestException(`Lỗi upload hình ảnh: ${error.message}`);
    }

    // Tạo records trong database
    const newImages = uploadedImages.map((image) => {
      return this.productImageRepo.create({
        product,
        image_url: image.url,
        description: `Product image for ${product.product_name}`,
      });
    });

    await this.productImageRepo.save(newImages);

    return {
      message: 'Thêm hình ảnh thành công',
      images: newImages,
      uploaded_count: uploadedImages.length,
    };
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
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    if (
      user.role?.role_name !== Role.ADMIN &&
      product.distributor.user_id !== user.user_id
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền xóa hình ảnh của sản phẩm này',
      );
    }

    if (!imageIds || imageIds.length === 0) {
      throw new BadRequestException(
        'Vui lòng chọn ít nhất một hình ảnh để xóa',
      );
    }

    const imagesToRemove = await this.productImageRepo.find({
      where: { product_image_id: In(imageIds) },
      relations: ['product'],
    });

    if (imagesToRemove.length === 0) {
      throw new NotFoundException('Không tìm thấy hình ảnh nào');
    }

    if (
      imagesToRemove.some((image) => image.product.product_id !== product_id)
    ) {
      throw new BadRequestException(
        'Một số hình ảnh không thuộc về sản phẩm này',
      );
    }

    // Xóa hình ảnh trên Cloudinary
    for (const image of imagesToRemove) {
      try {
        // Extract public_id from cloudinary URL
        const publicId = this.extractPublicIdFromUrl(image.image_url);
        if (publicId) {
          await this.cloudinaryService.deleteImage(publicId);
        }
      } catch (error) {
        console.error(`Lỗi xóa hình ảnh trên Cloudinary: ${error.message}`);
        // Vẫn tiếp tục xóa trong database
      }
    }

    await this.productImageRepo.remove(imagesToRemove);

    return {
      message: 'Xóa hình ảnh thành công',
      removed_count: imagesToRemove.length,
    };
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extract public_id from Cloudinary URL
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
      const parts = url.split('/');
      const uploadIndex = parts.findIndex((part) => part === 'upload');
      if (uploadIndex !== -1 && uploadIndex < parts.length - 1) {
        // Get everything after 'upload/vXXXXXXXXXX/' or 'upload/'
        const afterUpload = parts.slice(uploadIndex + 1);
        if (afterUpload[0] && afterUpload[0].startsWith('v')) {
          // Skip version
          return afterUpload.slice(1).join('/').split('.')[0];
        } else {
          return afterUpload.join('/').split('.')[0];
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  }

  // === RECOMMENDATION SYSTEM ===

  /**
   * Hệ thống đề xuất sản phẩm dựa trên Collaborative Filtering
   * @param userId ID của user cần đề xuất
   * @param limit Số lượng sản phẩm đề xuất (default: 10)
   * @param similarUsersLimit Số lượng user tương tự để tính toán (default: 20)
   * @returns Array of recommended products with scores
   */
  async getRecommendationsForUser(
    userId: string,
    limit: number = 10,
    similarUsersLimit: number = 20,
  ) {
    try {
      // Kiểm tra user tồn tại
      const targetUser = await this.userRepo.findOne({
        where: { user_id: userId, is_deleted: false },
      });

      if (!targetUser) {
        throw new NotFoundException('User không tồn tại');
      }

      // Lấy lịch sử mua hàng và review của user
      const userHistory = await this.getUserPurchaseAndReviewHistory(userId);

      // Nếu user chưa có lịch sử, return popular products
      if (userHistory.length === 0) {
        return await this.getPopularProducts(limit);
      }

      // Tạo user-product matrix cho tất cả users
      const userProductMatrix = await this.buildUserProductMatrix();

      // Tìm users tương tự
      const similarUsers = await this.findSimilarUsers(
        userId,
        userProductMatrix,
        similarUsersLimit,
      );

      // Tính điểm dự đoán cho các sản phẩm chưa mua
      const recommendations = await this.calculateRecommendations(
        userId,
        similarUsers,
        userProductMatrix,
        limit,
      );

      return recommendations;
    } catch (error) {
      console.error('Error in getRecommendationsForUser:', error);
      // Fallback to popular products
      return await this.getPopularProducts(limit);
    }
  }

  /**
   * Lấy lịch sử mua hàng và review của user
   */
  private async getUserPurchaseAndReviewHistory(userId: string) {
    // Lấy lịch sử mua hàng
    const purchaseHistory = await this.productRepo
      .createQueryBuilder('product')
      .select([
        'product.product_id as product_id',
        'product.product_name as product_name',
        'COUNT(DISTINCT order_detail.order_detail_id) as purchase_count',
        'MAX(order.created_at) as last_purchase_date',
      ])
      .leftJoin('product.batches', 'batch_product')
      .leftJoin('batch_product.order_details', 'order_detail')
      .leftJoin('order_detail.order', 'order')
      .leftJoin('order.user', 'user')
      .where('user.user_id = :userId', { userId })
      .andWhere('product.is_deleted = false')
      .andWhere('batch_product.is_deleted = false')
      .andWhere('order_detail.is_deleted = false')
      .andWhere('order.is_deleted = false')
      .groupBy('product.product_id, product.product_name')
      .getRawMany();

    // Lấy lịch sử review
    const reviewHistory = await this.productRepo
      .createQueryBuilder('product')
      .select([
        'product.product_id as product_id',
        'AVG(review.rating) as avg_rating',
      ])
      .leftJoin('product.reviews', 'review')
      .where('review.user.user_id = :userId', { userId })
      .andWhere('product.is_deleted = false')
      .andWhere('review.is_deleted = false')
      .andWhere('review.rating IS NOT NULL')
      .groupBy('product.product_id')
      .getRawMany();

    // Combine purchase và review data
    const combinedHistory = purchaseHistory.map((purchase) => {
      const review = reviewHistory.find(
        (r) => r.product_id === purchase.product_id,
      );
      return {
        ...purchase,
        avg_rating: review?.avg_rating || null,
        purchase_count: parseInt(purchase.purchase_count) || 0,
      };
    });

    return combinedHistory.sort(
      (a, b) =>
        new Date(b.last_purchase_date).getTime() -
        new Date(a.last_purchase_date).getTime(),
    );
  } /**
   * Xây dựng user-product matrix cho tất cả users
   */
  private async buildUserProductMatrix() {
    // Lấy purchase scores
    const purchaseScores = await this.userRepo
      .createQueryBuilder('user')
      .select([
        'user.user_id as user_id',
        'product.product_id as product_id',
        'COUNT(order_detail.order_detail_id) * 0.3 as score',
      ])
      .leftJoin('user.orders', 'order')
      .leftJoin('order.order_details', 'order_detail')
      .leftJoin('order_detail.batch_product', 'batch_product')
      .leftJoin('batch_product.product', 'product')
      .where('user.is_deleted = false')
      .andWhere('order.is_deleted = false')
      .andWhere('order_detail.is_deleted = false')
      .andWhere('batch_product.is_deleted = false')
      .andWhere('product.is_deleted = false')
      .andWhere('product.is_active = true')
      .groupBy('user.user_id, product.product_id')
      .getRawMany();

    // Lấy review scores
    const reviewScores = await this.userRepo
      .createQueryBuilder('user')
      .select([
        'user.user_id as user_id',
        'review.product.product_id as product_id',
        'AVG(review.rating) * 0.7 / 5 as score',
      ])
      .leftJoin('user.reviews', 'review')
      .leftJoin('review.product', 'product')
      .where('user.is_deleted = false')
      .andWhere('review.is_deleted = false')
      .andWhere('review.rating IS NOT NULL')
      .andWhere('product.is_deleted = false')
      .andWhere('product.is_active = true')
      .groupBy('user.user_id, review.product.product_id')
      .getRawMany();

    // Combine scores và tạo matrix
    const matrix = {};

    // Add purchase scores
    purchaseScores.forEach((row) => {
      if (!matrix[row.user_id]) {
        matrix[row.user_id] = {};
      }
      matrix[row.user_id][row.product_id] = parseFloat(row.score) || 0;
    });

    // Add review scores
    reviewScores.forEach((row) => {
      if (!matrix[row.user_id]) {
        matrix[row.user_id] = {};
      }
      const currentScore = matrix[row.user_id][row.product_id] || 0;
      matrix[row.user_id][row.product_id] =
        currentScore + (parseFloat(row.score) || 0);
    });

    return matrix;
  }

  /**
   * Tìm users có hành vi tương tự bằng Cosine Similarity
   */
  private async findSimilarUsers(
    targetUserId: string,
    userProductMatrix: any,
    limit: number,
  ): Promise<SimilarUser[]> {
    const targetUserVector = userProductMatrix[targetUserId] || {};
    const similarities: SimilarUser[] = [];

    for (const userId in userProductMatrix) {
      if (userId === targetUserId) continue;

      const userVector = userProductMatrix[userId];
      const similarity = this.calculateCosineSimilarity(
        targetUserVector,
        userVector,
      );

      if (similarity > 0) {
        similarities.push({
          userId,
          similarity,
        });
      }
    }

    // Sort by similarity descending và lấy top N
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Tính Cosine Similarity giữa 2 vectors
   */
  private calculateCosineSimilarity(vectorA: any, vectorB: any) {
    const commonProducts = Object.keys(vectorA).filter(
      (productId) => vectorB[productId] !== undefined,
    );

    if (commonProducts.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    commonProducts.forEach((productId) => {
      const scoreA = vectorA[productId] || 0;
      const scoreB = vectorB[productId] || 0;

      dotProduct += scoreA * scoreB;
      normA += scoreA * scoreA;
      normB += scoreB * scoreB;
    });

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Tính điểm dự đoán và tạo recommendations
   */
  private async calculateRecommendations(
    targetUserId: string,
    similarUsers: SimilarUser[],
    userProductMatrix: any,
    limit: number,
  ) {
    const targetUserProducts = new Set(
      Object.keys(userProductMatrix[targetUserId] || {}),
    );

    const productScores: {
      [key: string]: {
        weightedSum: number;
        similaritySum: number;
        voters: number;
      };
    } = {};

    // Tính predicted score cho từng sản phẩm
    similarUsers.forEach(({ userId, similarity }) => {
      const userProducts = userProductMatrix[userId] || {};

      Object.keys(userProducts).forEach((productId) => {
        if (!targetUserProducts.has(productId)) {
          if (!productScores[productId]) {
            productScores[productId] = {
              weightedSum: 0,
              similaritySum: 0,
              voters: 0,
            };
          }

          productScores[productId].weightedSum +=
            userProducts[productId] * similarity;
          productScores[productId].similaritySum += similarity;
          productScores[productId].voters += 1;
        }
      });
    });

    // Tính predicted score và sort
    const predictions: PredictionScore[] = [];
    for (const productId in productScores) {
      const { weightedSum, similaritySum, voters } = productScores[productId];

      if (similaritySum > 0 && voters >= 2) {
        // Ít nhất 2 users tương tự
        const predictedScore = weightedSum / similaritySum;
        const confidence = Math.min(voters / 5, 1); // Confidence based on số lượng voters

        predictions.push({
          productId,
          predictedScore,
          confidence,
          voters,
        });
      }
    }

    // Sort by predicted score và confidence
    predictions.sort((a, b) => {
      const scoreA = a.predictedScore * a.confidence;
      const scoreB = b.predictedScore * b.confidence;
      return scoreB - scoreA;
    });

    // Lấy thông tin chi tiết của products
    const topProductIds = predictions.slice(0, limit).map((p) => p.productId);

    if (topProductIds.length === 0) {
      return await this.getPopularProducts(limit);
    }

    const products = await this.productRepo.find({
      where: {
        product_id: In(topProductIds),
        is_deleted: false,
        is_active: true,
      },
      relations: [
        'images',
        'categories',
        'distributor',
        'manufacturer',
        'batches',
      ],
    });

    // Combine với prediction data
    const recommendations = products.map((product) => {
      const prediction = predictions.find(
        (p) => p.productId === product.product_id,
      );
      return {
        ...this.serializeProduct(product),
        predictedScore: prediction?.predictedScore || 0,
        confidence: prediction?.confidence || 0,
        recommendationReason: this.generateRecommendationReason(
          prediction?.voters || 0,
        ),
      };
    });

    return recommendations;
  }

  /**
   * Fallback: Trả về sản phẩm phổ biến nhất
   */
  async getPopularProducts(limit: number) {
    // Sử dụng product.total_saled để sắp xếp theo số lượng bán ra
    return await this.productRepo.find({
      where: { is_deleted: false, is_active: true },
      relations: [
        'images',
        'categories',
        'distributor',
        'distributor.invenstory',
        'manufacturer',
        'batches',
        'batches.product_types',
        'batches.promotions',
        'product_ingredients',
        'product_ingredients.ingredient',
        'productDiseases',
        'productDiseases.disease',
      ],
      order: {
        total_saled: 'DESC',
        created_at: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Generate lý do recommend
   */
  private generateRecommendationReason(voters: number): string {
    if (voters >= 10) {
      return 'Được nhiều khách hàng có sở thích tương tự yêu thích';
    } else if (voters >= 5) {
      return 'Khách hàng có sở thích tương tự đã mua';
    } else if (voters >= 2) {
      return 'Một số khách hàng tương tự quan tâm';
    }
    return 'Sản phẩm được đề xuất cho bạn';
  }

  /**
   * Content-based recommendations dựa trên categories đã mua
   */
  async getContentBasedRecommendations(userId: string, limit: number = 10) {
    // Lấy các category mà user đã mua nhiều nhất bằng TypeORM
    const userCategories = await this.userRepo
      .createQueryBuilder('user')
      .select(['category.id as category_id', 'COUNT(*) as purchase_frequency'])
      .innerJoin('user.orders', 'order')
      .innerJoin('order.order_details', 'order_detail')
      .innerJoin('order_detail.batch_product', 'batch_product')
      .innerJoin('batch_product.product', 'product')
      .innerJoin('product.categories', 'category')
      .where('user.user_id = :userId', { userId })
      .andWhere('order.is_deleted = false')
      .andWhere('order_detail.is_deleted = false')
      .andWhere('batch_product.is_deleted = false')
      .andWhere('product.is_deleted = false')
      .andWhere('category.isDeleted = false')
      .groupBy('category.id')
      .orderBy('purchase_frequency', 'DESC')
      .limit(5)
      .getRawMany();

    if (userCategories.length === 0) {
      return await this.getPopularProducts(limit);
    }

    const categoryIds = userCategories.map((row) => row.category_id);

    // Lấy sản phẩm từ categories mà user đã quan tâm nhưng chưa mua
    const products = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.distributor', 'distributor')
      .leftJoinAndSelect('distributor.invenstory', 'invenstory')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.batches', 'batches')
      .leftJoinAndSelect('batches.product_types', 'product_types')
      .leftJoinAndSelect('batches.promotions', 'promotions')
      .leftJoinAndSelect('product.product_ingredients', 'product_ingredients')
      .leftJoinAndSelect('product_ingredients.ingredient', 'ingredient')
      .leftJoinAndSelect('product.productDiseases', 'productDiseases')
      .leftJoinAndSelect('productDiseases.disease', 'disease')
      .where('product.is_deleted = false')
      .andWhere('product.is_active = true')
      .andWhere('category.id IN (:...categoryIds)', { categoryIds })
      .andWhere(
        'product.product_id NOT IN (SELECT DISTINCT p.product_id FROM "order" o JOIN order_detail od ON o.order_id = od.order_id JOIN batch_product bp ON od.batch_id = bp.batch_id JOIN product p ON bp.product_id = p.product_id WHERE o.user_id = :userId)',
        { userId },
      )
      .orderBy('product.created_at', 'DESC')
      .limit(limit)
      .getMany();

    return products;
  }
}
