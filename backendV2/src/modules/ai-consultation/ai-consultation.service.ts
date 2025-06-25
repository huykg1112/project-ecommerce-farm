import { Injectable } from '@nestjs/common';
import { CreateAiConsultationDto } from './dto/create-ai-consultation.dto';
import { UpdateAiConsultationDto } from './dto/update-ai-consultation.dto';

@Injectable()
export class AiConsultationService {
  create(createAiConsultationDto: CreateAiConsultationDto) {
    return 'This action adds a new aiConsultation';
  }

  findAll() {
    return `This action returns all aiConsultation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiConsultation`;
  }

  update(id: number, updateAiConsultationDto: UpdateAiConsultationDto) {
    return `This action updates a #${id} aiConsultation`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiConsultation`;
  }
}
