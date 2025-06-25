import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiConsultationService } from './ai-consultation.service';
import { CreateAiConsultationDto } from './dto/create-ai-consultation.dto';
import { UpdateAiConsultationDto } from './dto/update-ai-consultation.dto';

@Controller('ai-consultation')
export class AiConsultationController {
  constructor(private readonly aiConsultationService: AiConsultationService) {}

  @Post()
  create(@Body() createAiConsultationDto: CreateAiConsultationDto) {
    return this.aiConsultationService.create(createAiConsultationDto);
  }

  @Get()
  findAll() {
    return this.aiConsultationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiConsultationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiConsultationDto: UpdateAiConsultationDto) {
    return this.aiConsultationService.update(+id, updateAiConsultationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiConsultationService.remove(+id);
  }
}
