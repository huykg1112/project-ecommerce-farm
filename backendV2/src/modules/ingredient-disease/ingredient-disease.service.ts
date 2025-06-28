import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredientDiseaseDto } from './dto/create-ingredient-disease.dto';
import { UpdateIngredientDiseaseDto } from './dto/update-ingredient-disease.dto';
import { IngredientDisease } from './entities/ingredient-disease.entity';

@Injectable()
export class IngredientDiseaseService {
  constructor(
    @InjectRepository(IngredientDisease)
    private readonly repo: Repository<IngredientDisease>,
  ) {}

  async create(dto: CreateIngredientDiseaseDto) {
    const exists = await this.repo.findOne({
      where: { ingredient_id: dto.ingredient_id, disease_id: dto.disease_id },
    });
    if (exists) throw new NotFoundException('Liên kết đã tồn tại');
    const entity = this.repo.create(dto);
    return await this.repo.save(entity);
  }

  async findAll() {
    return await this.repo.find({ relations: ['ingredient', 'disease'] });
  }

  async findOne(ingredient_id: string, disease_id: string) {
    const rel = await this.repo.findOne({
      where: { ingredient_id, disease_id },
      relations: ['ingredient', 'disease'],
    });
    if (!rel) throw new NotFoundException('Không tìm thấy liên kết');
    return rel;
  }

  async update(
    ingredient_id: string,
    disease_id: string,
    dto: UpdateIngredientDiseaseDto,
  ) {
    const rel = await this.repo.findOne({
      where: { ingredient_id, disease_id },
    });
    if (!rel) throw new NotFoundException('Không tìm thấy liên kết');
    Object.assign(rel, dto);
    return await this.repo.save(rel);
  }

  async remove(ingredient_id: string, disease_id: string) {
    const rel = await this.repo.findOne({
      where: { ingredient_id, disease_id },
    });
    if (!rel) throw new NotFoundException('Không tìm thấy liên kết');
    await this.repo.remove(rel);
    return { message: 'Xóa liên kết thành công' };
  }

  async findByDisease(disease_id: string, is_primary?: boolean) {
    const where: any = { disease_id };
    if (is_primary !== undefined) where.is_primary = is_primary;
    return await this.repo.find({
      where,
      relations: ['ingredient'],
    });
  }

  async findByIngredient(ingredient_id: string, is_primary?: boolean) {
    const where: any = { ingredient_id };
    if (is_primary !== undefined) where.is_primary = is_primary;
    return await this.repo.find({
      where,
      relations: ['disease'],
    });
  }
}
