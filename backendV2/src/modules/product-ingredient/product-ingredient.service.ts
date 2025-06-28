import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveIngredient } from '../active-ingredient/entities/active-ingredient.entity';
import { Product } from '../product/entities/product.entity';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dto/update-product-ingredient.dto';
import { ProductIngredient } from './entities/product-ingredient.entity';

@Injectable()
export class ProductIngredientService {
  constructor(
    @InjectRepository(ProductIngredient)
    private readonly piRepo: Repository<ProductIngredient>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ActiveIngredient)
    private readonly ingredientRepo: Repository<ActiveIngredient>,
  ) {}

  async create(dto: CreateProductIngredientDto) {
    // Kiểm tra tồn tại product và ingredient
    const product = await this.productRepo.findOne({
      where: { product_id: dto.product_id },
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_id: dto.ingredient_id },
    });
    if (!ingredient) throw new NotFoundException('Không tìm thấy thành phần');
    // Tạo mới
    const entity = this.piRepo.create(dto);
    return await this.piRepo.save(entity);
  }

  async update(
    product_id: string,
    ingredient_id: string,
    dto: UpdateProductIngredientDto,
  ) {
    const rel = await this.piRepo.findOne({
      where: { product_id, ingredient_id },
    });
    if (!rel)
      throw new NotFoundException('Không tìm thấy quan hệ sản phẩm-thành phần');
    Object.assign(rel, dto);
    return await this.piRepo.save(rel);
  }

  async remove(product_id: string, ingredient_id: string) {
    const rel = await this.piRepo.findOne({
      where: { product_id, ingredient_id },
    });
    if (!rel)
      throw new NotFoundException('Không tìm thấy quan hệ sản phẩm-thành phần');
    await this.piRepo.remove(rel);
    return { message: 'Xóa thành công' };
  }

  async findAll() {
    return await this.piRepo.find({ relations: ['product', 'ingredient'] });
  }

  async findOne(product_id: string, ingredient_id: string) {
    const rel = await this.piRepo.findOne({
      where: { product_id, ingredient_id },
      relations: ['product', 'ingredient'],
    });
    if (!rel)
      throw new NotFoundException('Không tìm thấy quan hệ sản phẩm-thành phần');
    return rel;
  }

  async findByProduct(product_id: string) {
    return await this.piRepo.find({
      where: { product_id },
      relations: ['ingredient'],
    });
  }

  async findByIngredient(ingredient_id: string) {
    return await this.piRepo.find({
      where: { ingredient_id },
      relations: ['product'],
    });
  }
}
