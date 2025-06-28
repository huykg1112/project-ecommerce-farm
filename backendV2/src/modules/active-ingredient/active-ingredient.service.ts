import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientDisease } from '../ingredient-disease/entities/ingredient-disease.entity';
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
    @InjectRepository(IngredientDisease)
    private readonly ingredientDiseaseRepo: Repository<IngredientDisease>,
    @InjectRepository(ProductIngredient)
    private readonly piRepo: Repository<ProductIngredient>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateActiveIngredientDto) {
    const entity = this.ingredientRepo.create(dto);
    return await this.ingredientRepo.save(entity);
  }

  async findAll() {
    return await this.ingredientRepo.find();
  }

  async findOne(id: string) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_id: id },
      relations: ['ingredientDiseases', 'ingredientDiseases.disease'],
    });
    if (!ingredient) throw new NotFoundException('Không tìm thấy hoạt chất');
    // Phân loại bệnh đặc trị/hỗ trợ
    const diseases = (ingredient.ingredientDiseases || []).map((rel) => ({
      disease: rel.disease,
      is_primary: rel.is_primary,
      note: rel.note,
      effectiveness_description: rel.effectiveness_description,
    }));
    return { ...ingredient, diseases };
  }

  async update(id: string, dto: UpdateActiveIngredientDto) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_id: id },
    });
    if (!ingredient) throw new NotFoundException('Không tìm thấy hoạt chất');
    Object.assign(ingredient, dto);
    return await this.ingredientRepo.save(ingredient);
  }

  async remove(id: string) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ingredient_id: id },
    });
    if (!ingredient) throw new NotFoundException('Không tìm thấy hoạt chất');
    await this.ingredientRepo.remove(ingredient);
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
}
