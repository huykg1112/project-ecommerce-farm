import { PartialType } from '@nestjs/mapped-types';
import { CreateAiConsultationDto } from './create-ai-consultation.dto';

export class UpdateAiConsultationDto extends PartialType(CreateAiConsultationDto) {}
