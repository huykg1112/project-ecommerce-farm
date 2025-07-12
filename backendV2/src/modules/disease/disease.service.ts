import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { Disease } from './entities/disease.entity';

@Injectable()
export class DiseaseService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
  ) {}

  async create(createDiseaseDto: CreateDiseaseDto): Promise<Disease> {
    // Check for duplicate name (optional, can be removed if not needed)
    if (createDiseaseDto.disease_name) {
      const exists = await this.diseaseRepository.findOne({
        where: {
          disease_name: createDiseaseDto.disease_name,
          is_deleted: false,
        },
      });
      if (exists) throw new BadRequestException('Tên bệnh đã tồn tại');
    }
    const disease = this.diseaseRepository.create(createDiseaseDto);
    return this.diseaseRepository.save(disease);
  }

  async findAll(): Promise<Disease[]> {
    return this.diseaseRepository.find({ where: { is_deleted: false } });
  }

  async findOne(id: string): Promise<Disease> {
    const disease = await this.diseaseRepository.findOne({
      where: { disease_id: id, is_deleted: false },
    });
    if (!disease) throw new NotFoundException('Không tìm thấy bệnh');
    return disease;
  }

  async update(
    id: string,
    updateDiseaseDto: UpdateDiseaseDto,
  ): Promise<Disease> {
    const disease = await this.diseaseRepository.findOne({
      where: { disease_id: id, is_deleted: false },
    });
    if (!disease) throw new NotFoundException('Không tìm thấy bệnh');
    Object.assign(disease, updateDiseaseDto, { updated_at: new Date() });
    return this.diseaseRepository.save(disease);
  }

  async remove(id: string): Promise<{ message: string }> {
    const disease = await this.diseaseRepository.findOne({
      where: { disease_id: id, is_deleted: false },
    });
    if (!disease) throw new NotFoundException('Không tìm thấy bệnh');
    // Soft delete instead of hard delete
    disease.is_deleted = true;
    await this.diseaseRepository.save(disease);
    return { message: 'Xóa bệnh thành công' };
  }
}
