import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async createWithImage(
    createCategoryDto: CreateCategoryDto,
    imageUrl: string | null,
    publicId: string | null,
  ): Promise<Category> {
    const categoryData = {
      ...createCategoryDto,
      image: imageUrl || undefined,
      imagePublicId: publicId || undefined,
    };

    const category = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async softDelete(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isActive = false;
    return await this.categoryRepository.save(category);
  }

  async restore(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isActive = true;
    return await this.categoryRepository.save(category);
  }

  async updateCategoryImage(
    id: string,
    imageUrl: string,
    publicId: string,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Delete old image if exists
    if (category.imagePublicId) {
      await this.cloudinaryService.deleteImage(category.imagePublicId);
    }

    // Update category with new image
    category.image = imageUrl;
    category.imagePublicId = publicId;
    return await this.categoryRepository.save(category);
  }

  async findActiveCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async updateCategoryWithImage(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    imageUrl: string | null,
    publicId: string | null,
  ): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);

    // Update image if provided
    if (imageUrl && publicId) {
      category.image = imageUrl;
      category.imagePublicId = publicId;
    }

    return await this.categoryRepository.save(category);
  }
  async batchToggleStatus(
    ids: string[],
    isActive: boolean,
  ): Promise<Category[]> {
    const categories = await this.categoryRepository.findByIds(ids);
    categories.forEach((category) => {
      category.isActive = isActive;
    });
    return await this.categoryRepository.save(categories);
  }
  async batchDelete(ids: string[]): Promise<void> {
    const categories = await this.categoryRepository.findByIds(ids);
    if (categories.length === 0) {
      throw new NotFoundException('No categories found for deletion');
    }
    await this.categoryRepository.remove(categories);
  }
}
