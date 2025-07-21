import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { TreatmentPlan } from './entities/treatment-plan.entity';

@Injectable()
export class TreatmentPlanService {
  constructor(
    @InjectRepository(TreatmentPlan)
    private readonly treatmentPlanRepository: Repository<TreatmentPlan>,
  ) {}

  async create(createTreatmentPlanDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    const treatmentPlan = this.treatmentPlanRepository.create({
      ...createTreatmentPlanDto,
      consultation: createTreatmentPlanDto.consultation_id ? { consultation_id: createTreatmentPlanDto.consultation_id } as any : undefined,
      product: createTreatmentPlanDto.product_id ? { product_id: createTreatmentPlanDto.product_id } as any : undefined,
    });
    
    return await this.treatmentPlanRepository.save(treatmentPlan);
  }

  async findAll(): Promise<TreatmentPlan[]> {
    return await this.treatmentPlanRepository.find({
      where: { is_deleted: false },
      relations: ['consultation', 'product'],
      order: { day_number: 'ASC', created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TreatmentPlan> {
    const treatmentPlan = await this.treatmentPlanRepository.findOne({
      where: { treatment_plan_id: id, is_deleted: false },
      relations: ['consultation', 'product'],
    });

    if (!treatmentPlan) {
      throw new NotFoundException(`Treatment Plan with ID ${id} not found`);
    }

    return treatmentPlan;
  }

  async findByConsultation(consultationId: string): Promise<TreatmentPlan[]> {
    return await this.treatmentPlanRepository.find({
      where: { 
        consultation: { consultation_id: consultationId },
        is_deleted: false 
      },
      relations: ['consultation', 'product'],
      order: { day_number: 'ASC' },
    });
  }

  async findByProduct(productId: string): Promise<TreatmentPlan[]> {
    return await this.treatmentPlanRepository.find({
      where: { 
        product: { product_id: productId },
        is_deleted: false 
      },
      relations: ['consultation', 'product'],
      order: { day_number: 'ASC', created_at: 'DESC' },
    });
  }

  async findByDay(dayNumber: number): Promise<TreatmentPlan[]> {
    return await this.treatmentPlanRepository.find({
      where: { 
        day_number: dayNumber,
        is_deleted: false 
      },
      relations: ['consultation', 'product'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateTreatmentPlanDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan> {
    const treatmentPlan = await this.findOne(id);
    
    const updateData = {
      ...updateTreatmentPlanDto,
      updated_at: new Date(),
    };

    if (updateTreatmentPlanDto.consultation_id) {
      updateData['consultation'] = { consultation_id: updateTreatmentPlanDto.consultation_id } as any;
    }

    if (updateTreatmentPlanDto.product_id) {
      updateData['product'] = { product_id: updateTreatmentPlanDto.product_id } as any;
    }

    await this.treatmentPlanRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const treatmentPlan = await this.findOne(id);
    
    await this.treatmentPlanRepository.update(id, {
      is_deleted: true,
      updated_at: new Date(),
    });
  }

  async hardDelete(id: string): Promise<void> {
    const treatmentPlan = await this.findOne(id);
    await this.treatmentPlanRepository.delete(id);
  }

  async findByFrequency(frequency: string): Promise<TreatmentPlan[]> {
    return await this.treatmentPlanRepository.find({
      where: { 
        frequency: frequency,
        is_deleted: false 
      },
      relations: ['consultation', 'product'],
      order: { day_number: 'ASC', created_at: 'DESC' },
    });
  }

  async getStatistics(): Promise<any> {
    const total = await this.treatmentPlanRepository.count({
      where: { is_deleted: false }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.treatmentPlanRepository.count({
      where: { 
        is_deleted: false,
        created_at: today
      }
    });

    const frequencyStats = await this.treatmentPlanRepository
      .createQueryBuilder('plan')
      .select('plan.frequency', 'frequency')
      .addSelect('COUNT(*)', 'count')
      .where('plan.is_deleted = :isDeleted', { isDeleted: false })
      .groupBy('plan.frequency')
      .getRawMany();

    const dayStats = await this.treatmentPlanRepository
      .createQueryBuilder('plan')
      .select('plan.day_number', 'day_number')
      .addSelect('COUNT(*)', 'count')
      .where('plan.is_deleted = :isDeleted', { isDeleted: false })
      .groupBy('plan.day_number')
      .orderBy('plan.day_number', 'ASC')
      .getRawMany();

    const productUsageStats = await this.treatmentPlanRepository
      .createQueryBuilder('plan')
      .leftJoin('plan.product', 'product')
      .select('product.product_name', 'product_name')
      .addSelect('COUNT(*)', 'usage_count')
      .where('plan.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('product.product_id IS NOT NULL')
      .groupBy('product.product_id')
      .orderBy('usage_count', 'DESC')
      .getRawMany();

    return {
      total,
      todayCount,
      frequencyStats,
      dayStats,
      productUsageStats,
    };
  }

  async createBulk(treatmentPlans: CreateTreatmentPlanDto[]): Promise<TreatmentPlan[]> {
    const plans = treatmentPlans.map(dto => this.treatmentPlanRepository.create({
      ...dto,
      consultation: dto.consultation_id ? { consultation_id: dto.consultation_id } as any : undefined,
      product: dto.product_id ? { product_id: dto.product_id } as any : undefined,
    }));
    
    return await this.treatmentPlanRepository.save(plans);
  }
}
