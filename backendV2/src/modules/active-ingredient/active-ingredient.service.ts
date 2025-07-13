import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductIngredient } from '../product-ingredient/entities/product-ingredient.entity';
import { Product } from '../product/entities/product.entity';
import { CreateActiveIngredientDto } from './dto/create-active-ingredient.dto';
import { UpdateActiveIngredientDto } from './dto/update-active-ingredient.dto';
import { ActiveIngredient } from './entities/active-ingredient.entity';

@Injectable()
export class ActiveIngredientService {
  constructor(
    @InjectRepository(ActiveIngredient)
    private readonly ingredientRepo: Repository<ActiveIngredient>,
    @InjectRepository(ProductIngredient)
    private readonly piRepo: Repository<ProductIngredient>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateActiveIngredientDto) {
    // Kiểm tra xem hoạt chất đã tồn tại chưa
    const existingIngredient = await this.ingredientRepo.findOne({
      where: { ingredient_name: dto.ingredient_name, is_deleted: false },
    });
    if (existingIngredient) {
      throw new ConflictException('Hoạt chất đã tồn tại');
    }
    console.log('Creating active ingredient with data:', dto);

    const entity = this.ingredientRepo.create(dto);
    return await this.ingredientRepo.save(entity);
  }

  // ko lấy ingredient có is_deleted
  async findAll() {
    return await this.ingredientRepo.find({
      where: { is_deleted: false },
    });
  }

  async findOne(id: string) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_id: id, is_deleted: false },
    });
    if (!ingredient) throw new NotFoundException('Không tìm thấy hoạt chất');
    return ingredient;
  }

  async findByName(name: string) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_name: name, is_deleted: false },
    });
    return ingredient || null;
  }

  async update(id: string, dto: UpdateActiveIngredientDto) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_id: id, is_deleted: false },
    });
    if (!ingredient) throw new NotFoundException('Không tìm thấy hoạt chất');
    Object.assign(ingredient, dto);
    return await this.ingredientRepo.save(ingredient);
  }

  async remove(id: string) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_id: id, is_deleted: false },
    });
    if (!ingredient) throw new NotFoundException('Không tìm thấy hoạt chất');
    ingredient.is_deleted = true;
    await this.ingredientRepo.save(ingredient);
    return { message: 'Xóa hoạt chất thành công' };
  }

  async getProductsForIngredient(ingredient_id: string) {
    // Lấy tất cả sản phẩm chứa thành phần này
    const rels = await this.piRepo.find({
      where: { ingredient_id },
      relations: ['product'],
    });
    return rels.map((rel) => rel.product);
  }
  async batchToggleStatus(ingredientIds: string[], isActive: boolean) {
    await this.ingredientRepo.update(
      { ingredient_id: In(ingredientIds) },
      { is_active: isActive },
    );
    return {
      message: `Cập nhật trạng thái thành công cho ${ingredientIds.length} hoạt chất`,
    };
  }
  async toggleStatus(id: string) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_id: id },
    });
    if (!ingredient) throw new NotFoundException('Không tìm thấy hoạt chất');
    ingredient.is_active = !ingredient.is_active;
    return await this.ingredientRepo.save(ingredient);
  }
}
