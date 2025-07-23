import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disease } from '../disease/entities/disease.entity';
import { TreatmentPlan } from '../treatment-plan/entities/treatment-plan.entity';
import { User } from '../user/entities/user.entity';
import { CreateAiConsultationDto } from './dto/create-ai-consultation.dto';
import { UpdateAiConsultationDto } from './dto/update-ai-consultation.dto';
import { AiConsultation } from './entities/ai-consultation.entity';

@Injectable()
export class AiConsultationService {
  constructor(
    @InjectRepository(AiConsultation)
    private readonly aiConsultationRepository: Repository<AiConsultation>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TreatmentPlan)
    private readonly treatmentPlanRepository: Repository<TreatmentPlan>,
  ) {}

  async create(
    createAiConsultationDto: CreateAiConsultationDto,
    user_id: string,
  ): Promise<{ AiConsultation: AiConsultation; existing: boolean }> {
    // tìm AI Consultation theo disease name
    const existingConsultation = await this.aiConsultationRepository.findOne({
      where: {
        crop_type: createAiConsultationDto.crop_type,
        growth_stage: createAiConsultationDto.growth_stage,
        disease: {
          disease_name: createAiConsultationDto.disease_name,
          is_deleted: false,
        },
        is_deleted: false,
      },
      relations: ['user', 'disease', 'treatment_plans'],
    });
    if (existingConsultation) {
      // Nếu đã tồn tại thì trả về luôn
      return {
        AiConsultation: existingConsultation,
        existing: true,
      };
    }
    // tìm và kiểm tra user
    const user = await this.userRepository.findOne({
      where: { user_id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    // tìm theo tên disease nếu có
    const disease = await this.diseaseRepository.findOne({
      where: { disease_name: createAiConsultationDto.disease_name },
    });
    // nếu ko có thì tạo bênh
    let newDisease;
    if (disease) {
      newDisease = disease;
    } else {
      newDisease = this.diseaseRepository.create({
        disease_name: createAiConsultationDto.disease_name,
        description: createAiConsultationDto.symptom_description,
      });
      await this.diseaseRepository.save(newDisease);
    }
    // tạo mới AI Consultation và liên kết với user và disease nếu có
    const aiConsultation = this.aiConsultationRepository.create({
      crop_type: createAiConsultationDto.crop_type,
      symptom_description: createAiConsultationDto.symptom_description,
      growth_stage: createAiConsultationDto.growth_stage,
      recommended_treatment: createAiConsultationDto.recommended_treatment,
      user,
      disease: newDisease,
    });

    // Lưu AI Consultation trước để có ID
    const savedAiConsultation =
      await this.aiConsultationRepository.save(aiConsultation);

    // tạo các TreatmentPlan nếu có trong DTO
    if (
      createAiConsultationDto.treatment_plans &&
      createAiConsultationDto.treatment_plans.length > 0
    ) {
      for (const treatmentPlanDto of createAiConsultationDto.treatment_plans) {
        const treatmentPlan = this.treatmentPlanRepository.create({
          day_number: treatmentPlanDto.day_number,
          treatment_instruction: treatmentPlanDto.treatment_instruction,
          dosage_instruction: treatmentPlanDto.dosage_instruction,
          frequency: treatmentPlanDto.frequency,
          consultation: savedAiConsultation,
        });

        await this.treatmentPlanRepository.save(treatmentPlan);
      }
    }

    // trả về AiConsultation đã được lưu với đầy đủ relations
    const fullConsultation = await this.findOne(
      savedAiConsultation.consultation_id,
    );
    return { AiConsultation: fullConsultation, existing: false };
  }

  async findAll(): Promise<AiConsultation[]> {
    return await this.aiConsultationRepository.find({
      where: { is_deleted: false },
      relations: ['user', 'disease', 'treatment_plans'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AiConsultation> {
    const consultation = await this.aiConsultationRepository.findOne({
      where: { consultation_id: id, is_deleted: false },
      relations: ['user', 'disease', 'treatment_plans'],
    });

    if (!consultation) {
      throw new NotFoundException(`AI Consultation with ID ${id} not found`);
    }

    return consultation;
  }

  async findByUser(userId: string): Promise<AiConsultation[]> {
    return await this.aiConsultationRepository.find({
      where: {
        user: { user_id: userId },
        is_deleted: false,
      },
      relations: ['user', 'disease', 'treatment_plans'],
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: string,
    userId: string,
    updateAiConsultationDto: UpdateAiConsultationDto,
  ): Promise<AiConsultation> {
    const consultation = await this.findOne(id);

    const updateData = {
      ...updateAiConsultationDto,
      updated_at: new Date(),
    };

    if (userId) {
      updateData['user'] = { user_id: userId } as any;
    }

    await this.aiConsultationRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const consultation = await this.findOne(id);

    await this.aiConsultationRepository.update(id, {
      is_deleted: true,
      updated_at: new Date(),
    });
  }

  async hardDelete(id: string): Promise<void> {
    const consultation = await this.findOne(id);
    await this.aiConsultationRepository.delete(id);
  }

  async findByCropType(cropType: string): Promise<AiConsultation[]> {
    return await this.aiConsultationRepository.find({
      where: {
        crop_type: cropType,
        is_deleted: false,
      },
      relations: ['user', 'disease', 'treatment_plans'],
      order: { created_at: 'DESC' },
    });
  }

  async findByGrowthStage(growthStage: string): Promise<AiConsultation[]> {
    return await this.aiConsultationRepository.find({
      where: {
        growth_stage: growthStage,
        is_deleted: false,
      },
      relations: ['user', 'disease', 'treatment_plans'],
      order: { created_at: 'DESC' },
    });
  }

  async findByDisease(diseaseId: string): Promise<AiConsultation[]> {
    return await this.aiConsultationRepository.find({
      where: {
        disease: { disease_id: diseaseId },
        is_deleted: false,
      },
      relations: ['user', 'disease', 'treatment_plans'],
      order: { created_at: 'DESC' },
    });
  }

  async getStatistics(): Promise<any> {
    const total = await this.aiConsultationRepository.count({
      where: { is_deleted: false },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.aiConsultationRepository.count({
      where: {
        is_deleted: false,
        created_at: today,
      },
    });

    const cropTypeStats = await this.aiConsultationRepository
      .createQueryBuilder('consultation')
      .select('consultation.crop_type', 'crop_type')
      .addSelect('COUNT(*)', 'count')
      .where('consultation.is_deleted = :isDeleted', { isDeleted: false })
      .groupBy('consultation.crop_type')
      .getRawMany();

    const diseaseStats = await this.aiConsultationRepository
      .createQueryBuilder('consultation')
      .leftJoin('consultation.disease', 'disease')
      .select('disease.disease_name', 'disease_name')
      .addSelect('disease.disease_id', 'disease_id')
      .addSelect('COUNT(*)', 'count')
      .where('consultation.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('disease.disease_id IS NOT NULL')
      .groupBy('disease.disease_id')
      .addGroupBy('disease.disease_name')
      .getRawMany();

    // Thống kê theo giai đoạn phát triển
    const growthStageStats = await this.aiConsultationRepository
      .createQueryBuilder('consultation')
      .select('consultation.growth_stage', 'growth_stage')
      .addSelect('COUNT(*)', 'count')
      .where('consultation.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('consultation.growth_stage IS NOT NULL')
      .groupBy('consultation.growth_stage')
      .getRawMany();

    // Thống kê theo tháng (6 tháng gần nhất)
    const monthlyStats = await this.aiConsultationRepository
      .createQueryBuilder('consultation')
      .select('DATE_FORMAT(consultation.created_at, "%Y-%m")', 'month')
      .addSelect('COUNT(*)', 'count')
      .where('consultation.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('consultation.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      total,
      todayCount,
      cropTypeStats,
      diseaseStats,
      growthStageStats,
      monthlyStats,
    };
  }

  async findByDiseaseName(diseaseName: string): Promise<AiConsultation[]> {
    return await this.aiConsultationRepository.find({
      where: {
        disease: { disease_name: diseaseName },
        is_deleted: false,
      },
      relations: ['user', 'disease', 'treatment_plans'],
      order: { created_at: 'DESC' },
    });
  }

  async findWithFilters(filters: {
    crop_type?: string;
    growth_stage?: string;
    user_id?: string;
    disease_id?: string;
    disease_name?: string;
    from_date?: Date;
    to_date?: Date;
  }): Promise<AiConsultation[]> {
    const queryBuilder = this.aiConsultationRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.user', 'user')
      .leftJoinAndSelect('consultation.disease', 'disease')
      .leftJoinAndSelect('consultation.treatment_plans', 'treatment_plans')
      .where('consultation.is_deleted = :isDeleted', { isDeleted: false });

    if (filters.crop_type) {
      queryBuilder.andWhere('consultation.crop_type = :cropType', {
        cropType: filters.crop_type,
      });
    }

    if (filters.growth_stage) {
      queryBuilder.andWhere('consultation.growth_stage = :growthStage', {
        growthStage: filters.growth_stage,
      });
    }

    if (filters.user_id) {
      queryBuilder.andWhere('user.user_id = :userId', {
        userId: filters.user_id,
      });
    }

    if (filters.disease_id) {
      queryBuilder.andWhere('disease.disease_id = :diseaseId', {
        diseaseId: filters.disease_id,
      });
    }

    if (filters.disease_name) {
      queryBuilder.andWhere('disease.disease_name = :diseaseName', {
        diseaseName: filters.disease_name,
      });
    }

    if (filters.from_date) {
      queryBuilder.andWhere('consultation.created_at >= :fromDate', {
        fromDate: filters.from_date,
      });
    }

    if (filters.to_date) {
      queryBuilder.andWhere('consultation.created_at <= :toDate', {
        toDate: filters.to_date,
      });
    }

    return await queryBuilder
      .orderBy('consultation.created_at', 'DESC')
      .getMany();
  }
}
