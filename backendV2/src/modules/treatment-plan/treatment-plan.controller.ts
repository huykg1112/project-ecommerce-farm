import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TreatmentPlanService } from './treatment-plan.service';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';

@Controller('treatment-plan')
export class TreatmentPlanController {
  constructor(private readonly treatmentPlanService: TreatmentPlanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTreatmentPlanDto: CreateTreatmentPlanDto) {
    return this.treatmentPlanService.create(createTreatmentPlanDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  createBulk(@Body() treatmentPlans: CreateTreatmentPlanDto[]) {
    return this.treatmentPlanService.createBulk(treatmentPlans);
  }

  @Get()
  findAll() {
    return this.treatmentPlanService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.treatmentPlanService.getStatistics();
  }

  @Get('consultation/:consultationId')
  findByConsultation(@Param('consultationId') consultationId: string) {
    return this.treatmentPlanService.findByConsultation(consultationId);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.treatmentPlanService.findByProduct(productId);
  }

  @Get('day/:dayNumber')
  findByDay(@Param('dayNumber') dayNumber: string) {
    return this.treatmentPlanService.findByDay(+dayNumber);
  }

  @Get('frequency/:frequency')
  findByFrequency(@Param('frequency') frequency: string) {
    return this.treatmentPlanService.findByFrequency(frequency);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treatmentPlanService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTreatmentPlanDto: UpdateTreatmentPlanDto) {
    return this.treatmentPlanService.update(id, updateTreatmentPlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.treatmentPlanService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  hardDelete(@Param('id') id: string) {
    return this.treatmentPlanService.hardDelete(id);
  }
}
