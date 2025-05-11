import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { SearchIngredientDto } from './dto/search-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const ingredient = this.ingredientRepository.create(createIngredientDto);
    return await this.ingredientRepository.save(ingredient);
  }

  async findAll(searchDto: SearchIngredientDto): Promise<{ ingredients: Ingredient[]; total: number }> {
    const { name, chemicalFormula, toxicityLevel, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.ingredientRepository.createQueryBuilder('ingredient')
      .leftJoinAndSelect('ingredient.products', 'products');

    if (name) {
      queryBuilder.andWhere('ingredient.name ILIKE :name', { name: `%${name}%` });
    }

    if (chemicalFormula) {
      queryBuilder.andWhere('ingredient.chemicalFormula ILIKE :chemicalFormula', 
        { chemicalFormula: `%${chemicalFormula}%` });
    }

    if (toxicityLevel) {
      queryBuilder.andWhere('ingredient.toxicityLevel = :toxicityLevel', { toxicityLevel });
    }

    const [ingredients, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { ingredients, total };
  }

  async findOne(id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return ingredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.findOne(id);
    Object.assign(ingredient, updateIngredientDto);
    return await this.ingredientRepository.save(ingredient);
  }

  async remove(id: string): Promise<void> {
    const ingredient = await this.findOne(id);
    await this.ingredientRepository.remove(ingredient);
  }

  async findByName(name: string): Promise<Ingredient[]> {
    return await this.ingredientRepository.find({
      where: { name: name },
      relations: ['products'],
    });
  }

  async findByToxicityLevel(level: string): Promise<Ingredient[]> {
    return await this.ingredientRepository.find({
      where: { toxicityLevel: level },
      relations: ['products'],
    });
  }
} 