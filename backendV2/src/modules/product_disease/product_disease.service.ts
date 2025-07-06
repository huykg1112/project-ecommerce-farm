import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDiseaseDto } from './dto/create-product_disease.dto';
import { UpdateProductDiseaseDto } from './dto/update-product_disease.dto';
import { ProductDisease } from './entities/product_disease.entity';

@Injectable()
export class ProductDiseaseService {
  constructor(
    @InjectRepository(ProductDisease)
    private readonly repo: Repository<ProductDisease>,
  ) {}

  async create(dto: CreateProductDiseaseDto) {
    const exists = await this.repo.findOne({
      where: { product_id: dto.product_id, disease_id: dto.disease_id },
    });
    if (exists) throw new NotFoundException('Liên kết đã tồn tại');
    const entity = this.repo.create(dto);
    return await this.repo.save(entity);
  }

  async findAll() {
    return await this.repo.find({ relations: ['product', 'disease'] });
  }

  async findOne(product_id: string, disease_id: string) {
    const rel = await this.repo.findOne({
      where: { product_id, disease_id },
      relations: ['product', 'disease'],
    });
    if (!rel) throw new NotFoundException('Không tìm thấy liên kết');
    return rel;
  }

  async update(
    product_id: string,
    disease_id: string,
    dto: UpdateProductDiseaseDto,
  ) {
    const rel = await this.repo.findOne({
      where: { product_id, disease_id },
    });
    if (!rel) throw new NotFoundException('Không tìm thấy liên kết');
    Object.assign(rel, dto);
    return await this.repo.save(rel);
  }

  async remove(product_id: string, disease_id: string) {
    const rel = await this.repo.findOne({
      where: { product_id, disease_id },
    });
    if (!rel) throw new NotFoundException('Không tìm thấy liên kết');
    await this.repo.remove(rel);
    return { message: 'Xóa liên kết thành công' };
  }

  async findByProduct(product_id: string) {
    return await this.repo.find({
      where: { product_id },
      relations: ['disease'],
    });
  }

  async findByDisease(disease_id: string) {
    return await this.repo.find({
      where: { disease_id },
      relations: ['product'],
    });
  }

  async findPrimaryByProduct(product_id: string) {
    return await this.repo.find({
      where: { product_id, is_primary: true },
      relations: ['disease'],
    });
  }

  async findSupportByProduct(product_id: string) {
    return await this.repo.find({
      where: { product_id, is_primary: false },
      relations: ['disease'],
    });
  }

  async findPrimaryByDisease(disease_id: string) {
    return await this.repo.find({
      where: { disease_id, is_primary: true },
      relations: ['product'],
    });
  }

  async findSupportByDisease(disease_id: string) {
    return await this.repo.find({
      where: { disease_id, is_primary: false },
      relations: ['product'],
    });
  }

  async findByProductAndIsPrimary(product_id: string, is_primary: boolean) {
    return await this.repo.find({
      where: { product_id, is_primary },
      relations: ['disease'],
    });
  }
}
