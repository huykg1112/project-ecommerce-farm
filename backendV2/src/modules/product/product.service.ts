import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm/find-options/operator/In';
import { Role } from '../../auth/enums/role.enum';
import { Category } from '../category/entities/category.entity';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { ProductDisease } from '../product_disease/entities/product_disease.entity';
import { User } from '../user/entities/user.entity';
import { AdvancedProductFilterDto } from './dto/advanced-product-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
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
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProductDisease)
    private readonly productDiseaseRepo: Repository<ProductDisease>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    // Chỉ cho phép Distributor hoặc Admin
    if (
      ![Role.DISTRIBUTOR, Role.ADMIN].includes(user.role?.role_name as Role)
    ) {
      throw new ForbiddenException('Bạn không có quyền tạo sản phẩm');
    }
    // Lấy category
    const categories = await this.categoryRepo.find({
      where: { id: In(createProductDto.category_ids) },
    });
    if (categories.length !== createProductDto.category_ids.length) {
      throw new NotFoundException('Có category không tồn tại');
    }
    // Tạo product
    const product = this.productRepo.create({
      ...createProductDto,
      categories,
      distributor: user,
      unit_product_price: createProductDto.unit_product_price,
    });
    return await this.productRepo.save(product);
  }

  async findAll() {
    return await this.productRepo.find({
      where: { is_deleted: false },
      relations: [
        'categories',
        'distributor',
        'product_ingredients',
        'product_ingredients.ingredient',
      ],
      order: { created_at: 'DESC' },
    });
  }
  async findAllForUser() {
    return await this.productRepo.find({
      where: { is_active: true, is_deleted: false },
      relations: [
        'categories',
        'distributor',
        'product_ingredients',
        'product_ingredients.ingredient',
        'productDiseases',
        'productDiseases.disease',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async findByDistributor(distributor_id: string) {
    return await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.distributor', 'distributor')
      .leftJoinAndSelect('product.product_ingredients', 'product_ingredient')
      .leftJoinAndSelect('product_ingredient.ingredient', 'ingredient')
      .where('distributor.user_id = :distributor_id', { distributor_id })
      .orderBy('product.created_at', 'DESC')
      .getMany();
  }

  async findOne(product_id: string) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: [
        'categories',
        'distributor',
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
        'categories',
        'distributor',
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
      where: { product_id },
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
    // Nếu update category
    let categories = product.categories;
    if (updateProductDto.category_ids) {
      categories = await this.categoryRepo.find({
        where: { id: In(updateProductDto.category_ids) },
      });
      if (categories.length !== updateProductDto.category_ids.length) {
        throw new NotFoundException('Có category không tồn tại');
      }
    }
    Object.assign(product, updateProductDto, { categories });
    return await this.productRepo.save(product);
  }

  async remove(product_id: string, user: User) {
    const product = await this.productRepo.findOne({
      where: { product_id, is_deleted: false },
      relations: ['distributor'],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    if (
      (user.role?.role_name as Role) !== Role.ADMIN &&
      product.distributor.user_id !== user.user_id
    ) {
      throw new ForbiddenException('Bạn không có quyền xóa sản phẩm này');
    }
    await this.productRepo.remove(product);
    return { message: 'Xóa sản phẩm thành công' };
  }

  async getIngredientsForProduct(product_id: string) {
    // Lấy tất cả thành phần của sản phẩm, join sang ActiveIngredient
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
    // Tính avg rating
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
      distributor: product.distributor
        ? {
            user_id: product.distributor.user_id,
            full_name: product.distributor.full_name,
          }
        : null,
      images: product['images'] || [], // Nếu có join images
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
      .leftJoinAndSelect('product.product_ingredients', 'product_ingredient')
      .leftJoinAndSelect('product_ingredient.ingredient', 'ingredient')
      .leftJoinAndSelect('product.productDiseases', 'productDisease')
      .leftJoinAndSelect('productDisease.disease', 'disease')
      .leftJoinAndSelect('product.reviews', 'review');

    // Giá
    if (filter.max_price != null) {
      qb.andWhere('product.unit_product_price <= :max_price', {
        max_price: filter.max_price,
      });
    }
    // Số sao trung bình
    if (filter.min_avg_rating != null) {
      qb.addSelect('AVG(review.rating)', 'avg_rating')
        .groupBy('product.product_id')
        .having('AVG(review.rating) >= :min_avg_rating', {
          min_avg_rating: filter.min_avg_rating,
        });
    }
    // Danh sách ID
    if (filter.distributor_ids && filter.distributor_ids.length > 0) {
      qb.andWhere('distributor.user_id IN (:...distributor_ids)', {
        distributor_ids: filter.distributor_ids,
      });
    }
    if (filter.category_ids && filter.category_ids.length > 0) {
      qb.andWhere('category.category_id IN (:...category_ids)', {
        category_ids: filter.category_ids,
      });
    }
    if (filter.product_type_ids && filter.product_type_ids.length > 0) {
      qb.andWhere('ingredient.ingredient_id IN (:...product_type_ids)', {
        product_type_ids: filter.product_type_ids,
      }); // Giả sử product_type là 1 loại ingredient, nếu không thì join thêm bảng product_type
    }
    if (filter.ingredient_ids && filter.ingredient_ids.length > 0) {
      qb.andWhere('ingredient.ingredient_id IN (:...ingredient_ids)', {
        ingredient_ids: filter.ingredient_ids,
      });
    }
    if (filter.disease_ids && filter.disease_ids.length > 0) {
      qb.andWhere('disease.disease_id IN (:...disease_ids)', {
        disease_ids: filter.disease_ids,
      });
    }
    // Keyword
    if (filter.keyword) {
      qb.andWhere(
        `(
        LOWER(product.product_name) LIKE :kw
        OR LOWER(category.category_name) LIKE :kw
        OR LOWER(distributor.full_name) LIKE :kw
        OR LOWER(ingredient.ingredient_name) LIKE :kw
        OR LOWER(disease.disease_name) LIKE :kw
      )`,
        { kw: `%${filter.keyword.toLowerCase()}%` },
      );
    }
    qb.orderBy('product.unit_product_price', 'ASC')
      .addOrderBy('avg_rating', 'DESC', 'NULLS LAST')
      .addOrderBy('product.created_at', 'DESC');
    const products = await qb.getMany();
    return products.map((p) => this.serializeProduct(p));
  }
}
