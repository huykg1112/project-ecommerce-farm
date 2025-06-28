import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    const saved = await this.categoryRepository.save(category);
    return {
      message: 'Tạo danh mục thành công',
      data: saved,
    };
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      order: { created_at: 'DESC' },
    });
    return {
      message: 'Lấy danh sách danh mục thành công',
      data: categories,
      total: categories.length,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id: ${id}`);
    }
    return {
      message: 'Lấy thông tin danh mục thành công',
      data: category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id: ${id}`);
    }
    Object.assign(category, updateCategoryDto);
    const updated = await this.categoryRepository.save(category);
    return {
      message: 'Cập nhật danh mục thành công',
      data: updated,
    };
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });
    console.log(category);
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id: ${id}`);
    }
    await this.categoryRepository.remove(category);
    return {
      message: 'Xóa danh mục thành công',
      data: { category_id: id },
    };
  }
}
