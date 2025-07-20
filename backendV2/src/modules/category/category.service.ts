import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '@root/src/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
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
      where: { isDeleted: false },
    });
  }
  async findForUsers(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { isActive: true, isDeleted: false },
      relations: ['products'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }
  async findByName(name: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({
      where: { name, isDeleted: false },
    });
    if (!category) {
      return null;
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
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    // Soft delete instead of hard delete
    category.isDeleted = true;
    await this.categoryRepository.save(category);
  }

  async softDelete(id: string): Promise<Category> {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    category.isDeleted = true;
    // Optionally delete image from cloudinary if it exists
    if (category.imagePublicId) {
      await this.cloudinaryService.deleteImage(category.imagePublicId);
    }
    return await this.categoryRepository.save(category);
  }

  async restore(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isDeleted = false;
    return await this.categoryRepository.save(category);
  }

  async updateCategoryImage(
    id: string,
    imageUrl: string,
    publicId: string,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, isDeleted: false },
    });
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
      where: { isActive: true, isDeleted: false },
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

  async toggleStatus(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isActive = !category.isActive;
    return await this.categoryRepository.save(category);
  }
}
