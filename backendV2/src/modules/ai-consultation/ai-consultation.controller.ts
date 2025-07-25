import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AiConsultationService } from './ai-consultation.service';
import { CreateAiConsultationDto } from './dto/create-ai-consultation.dto';
import { UpdateAiConsultationDto } from './dto/update-ai-consultation.dto';

@Controller('ai-consultation')
export class AiConsultationController {
  constructor(private readonly aiConsultationService: AiConsultationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAiConsultationDto: CreateAiConsultationDto, @Req() req) {
    const userId = req.user.id; // Assuming the user ID is available in the request object
    return this.aiConsultationService.create(createAiConsultationDto, userId);
  }

  @Get()
  findAll() {
    return this.aiConsultationService.findAll();
  }

  @Get('my-consultations')
  findMyConsultations(@Req() req) {
    const userId = req.user.id; // Assuming the user ID is available in the request object
    return this.aiConsultationService.findByUser(userId);
  }

  @Get('statistics')
  getStatistics() {
    return this.aiConsultationService.getStatistics();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.aiConsultationService.findByUser(userId);
  }

  @Get('crop-type/:cropType')
  findByCropType(@Param('cropType') cropType: string) {
    return this.aiConsultationService.findByCropType(cropType);
  }

  @Get('growth-stage/:growthStage')
  findByGrowthStage(@Param('growthStage') growthStage: string) {
    return this.aiConsultationService.findByGrowthStage(growthStage);
  }

  @Get('disease/:diseaseId')
  findByDisease(@Param('diseaseId') diseaseId: string) {
    return this.aiConsultationService.findByDisease(diseaseId);
  }

  @Get('disease-name/:diseaseName')
  findByDiseaseName(@Param('diseaseName') diseaseName: string) {
    return this.aiConsultationService.findByDiseaseName(diseaseName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiConsultationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateAiConsultationDto: UpdateAiConsultationDto,
  ) {
    const userId = req.user.id; // Assuming the user ID is available in the request object
    return this.aiConsultationService.update(
      id,
      userId,
      updateAiConsultationDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.aiConsultationService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  hardDelete(@Param('id') id: string) {
    return this.aiConsultationService.hardDelete(id);
  }
}
